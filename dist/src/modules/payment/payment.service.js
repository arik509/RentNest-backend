import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import stripe from "./stripe.js";
const createPayment = async (tenantId, payload) => {
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: payload.rentalRequestId.trim()
        },
        include: {
            property: true
        }
    });
    if (!rentalRequest) {
        throw new AppError(404, "Rental request not found");
    }
    if (rentalRequest.tenantId !== tenantId) {
        throw new AppError(403, "You cannot pay for this request");
    }
    if (rentalRequest.status !== "APPROVED") {
        throw new AppError(400, "Rental request is not approved");
    }
    if (rentalRequest.property.availabilityStatus
        !== "AVAILABLE") {
        throw new AppError(400, "Property is not available");
    }
    const existingPayment = await prisma.payment.findUnique({
        where: {
            rentalRequestId: payload.rentalRequestId.trim()
        }
    });
    if (existingPayment?.status === "COMPLETED") {
        throw new AppError(400, "Payment has already been completed for this rental request");
    }
    if (existingPayment?.status === "PENDING") {
        const existingSession = await stripe.checkout.sessions.retrieve(existingPayment.transactionId);
        if (existingSession.status === "open") {
            return {
                payment: existingPayment,
                checkoutUrl: existingSession.url
            };
        }
        if (existingSession.status === "complete") {
            throw new AppError(400, "Payment checkout has already been completed");
        }
    }
    const amount = Number(rentalRequest.property.price);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: [
            "card"
        ],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: rentalRequest.property.title
                    },
                    unit_amount: Math.round(amount * 100)
                },
                quantity: 1
            }
        ],
        success_url: "http://localhost:3000/payment-success",
        cancel_url: "http://localhost:3000/payment-cancel"
    });
    const payment = existingPayment
        ? await prisma.payment.update({
            where: {
                id: existingPayment.id
            },
            data: {
                amount,
                method: payload.method,
                provider: "STRIPE",
                status: "PENDING",
                transactionId: session.id,
                paidAt: null
            }
        })
        : await prisma.payment.create({
            data: {
                rentalRequestId: payload.rentalRequestId.trim(),
                amount,
                method: payload.method,
                provider: "STRIPE",
                status: "PENDING",
                transactionId: session.id
            }
        });
    return {
        payment,
        checkoutUrl: session.url
    };
};
const getPaymentHistory = async (tenantId) => {
    return prisma.payment.findMany({
        where: {
            rentalRequest: {
                tenantId
            }
        },
        include: {
            rentalRequest: {
                include: {
                    property: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};
const getPaymentById = async (tenantId, paymentId) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id: paymentId
        },
        include: {
            rentalRequest: true
        }
    });
    if (!payment) {
        throw new AppError(404, "Payment not found");
    }
    if (payment.rentalRequest.tenantId
        !== tenantId) {
        throw new AppError(403, "You cannot access this payment");
    }
    return payment;
};
export const paymentService = {
    createPayment,
    getPaymentHistory,
    getPaymentById
};
