import { paymentService } from "./payment.service.js";
import sendResponse from "../../utils/sendResponse.js";
import stripe from "./stripe.js";
import prisma from "../../lib/prisma.js";
import { config } from "../../config/index.js";
import AppError from "../../errors/AppError.js";
const createPayment = async (req, res) => {
    const result = await paymentService.createPayment(req.user.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Payment session created successfully",
        data: result
    });
};
const getPaymentHistory = async (req, res) => {
    const result = await paymentService.getPaymentHistory(req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment history retrieved successfully",
        data: result
    });
};
const getPaymentById = async (req, res) => {
    const result = await paymentService.getPaymentById(req.user.id, req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Payment retrieved successfully",
        data: result
    });
};
const webhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];
    if (!signature ||
        Array.isArray(signature)) {
        return res.status(400).json({
            success: false,
            message: "Stripe signature is missing",
            errorDetails: null
        });
    }
    let event;
    try {
        event =
            stripe.webhooks.constructEvent(req.body, signature, config.stripe.stripeWebhookSecret);
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Webhook verification failed",
            errorDetails: null
        });
    }
    if (event.type ===
        "checkout.session.completed") {
        const session = event.data.object;
        if (session.payment_status !== "paid") {
            return res.status(200).json({
                received: true
            });
        }
        await prisma.$transaction(async (transaction) => {
            const payment = await transaction.payment.findUnique({
                where: {
                    transactionId: session.id
                },
                include: {
                    rentalRequest: {
                        select: {
                            id: true,
                            status: true,
                            property: {
                                select: {
                                    id: true,
                                    availabilityStatus: true
                                }
                            }
                        }
                    }
                }
            });
            if (!payment) {
                console.log("Payment not found for Stripe session:", session.id);
                return;
            }
            if (payment.status === "COMPLETED") {
                return;
            }
            if (payment.status !== "PENDING") {
                throw new AppError(409, "Payment is not pending");
            }
            if (payment.rentalRequest.status
                !== "APPROVED") {
                throw new AppError(409, "Rental request is not approved");
            }
            if (payment.rentalRequest.property
                .availabilityStatus
                !== "AVAILABLE") {
                throw new AppError(409, "Property is not available");
            }
            const paymentUpdate = await transaction.payment.updateMany({
                where: {
                    id: payment.id,
                    status: "PENDING"
                },
                data: {
                    status: "COMPLETED",
                    paidAt: new Date()
                }
            });
            if (paymentUpdate.count !== 1) {
                throw new AppError(409, "Payment state changed");
            }
            const rentalUpdate = await transaction.rentalRequest.updateMany({
                where: {
                    id: payment.rentalRequest.id,
                    status: "APPROVED"
                },
                data: {
                    status: "ACTIVE"
                }
            });
            if (rentalUpdate.count !== 1) {
                throw new AppError(409, "Rental request state changed");
            }
            const propertyUpdate = await transaction.property.updateMany({
                where: {
                    id: payment.rentalRequest.property.id,
                    availabilityStatus: "AVAILABLE"
                },
                data: {
                    availabilityStatus: "UNAVAILABLE"
                }
            });
            if (propertyUpdate.count !== 1) {
                throw new AppError(409, "Property availability changed");
            }
        });
    }
    return res.status(200).json({
        received: true
    });
};
export const paymentController = {
    createPayment,
    getPaymentHistory,
    getPaymentById,
    webhook
};
