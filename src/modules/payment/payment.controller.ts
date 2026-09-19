import {Request, Response } from "express";

import { AuthRequest } from "../../middlewares/auth.js";

import { paymentService } from "./payment.service.js";

import sendResponse from "../../utils/sendResponse.js";

import Stripe from "stripe";

import stripe from "./stripe.js";

import prisma from "../../lib/prisma.js";

import { config } from "../../config/index.js";





const createPayment = async(
    req:AuthRequest,
    res:Response
)=>{


    const result =
        await paymentService.createPayment(
            req.user!.id,
            req.body
        );


    sendResponse(
        res,
        {
            success:true,
            statusCode:201,
            message:"Payment session created successfully",
            data:result
        }
    );

};





const getPaymentHistory = async(
    req:AuthRequest,
    res:Response
)=>{


    const result =
        await paymentService.getPaymentHistory(
            req.user!.id
        );


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"Payment history retrieved successfully",
            data:result
        }
    );

};





const getPaymentById = async(
    req:AuthRequest,
    res:Response
)=>{


    const result =
        await paymentService.getPaymentById(
            req.user!.id,
            req.params.id as string
        );


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"Payment retrieved successfully",
            data:result
        }
    );

};



const webhook = async (
    req: Request,
    res: Response
) => {

    const signature =
        req.headers["stripe-signature"];


    if (
        !signature ||
        Array.isArray(signature)
    ) {
        return res.status(400).json({
            message: "Stripe signature is missing"
        });
    }


    let event: Stripe.Event;


    try {
        event =
            stripe.webhooks.constructEvent(
                req.body,
                signature,
                config.stripe.stripeWebhookSecret
            );

    } catch (error) {

        return res.status(400).json({
            message:
                "Webhook verification failed"
        });
    }


    if (
        event.type ===
        "checkout.session.completed"
    ) {

        const session =
            event.data.object as Stripe.Checkout.Session;


        
        if (
            session.payment_status !== "paid"
        ) {
            return res.status(200).json({
                received: true
            });
        }


        const payment =
            await prisma.payment.findUnique({
                where: {
                    transactionId:
                        session.id
                }
            });


        if (!payment) {

            console.log(
                "Payment not found for Stripe session:",
                session.id
            );

            return res.status(200).json({
                received: true
            });
        }


        
        if (
            payment.status === "COMPLETED"
        ) {
            return res.status(200).json({
                received: true
            });
        }


        await prisma.$transaction([

            prisma.payment.update({
                where: {
                    id: payment.id
                },

                data: {
                    status: "COMPLETED",
                    paidAt: new Date()
                }
            }),


            prisma.rentalRequest.update({
                where: {
                    id:
                        payment.rentalRequestId
                },

                data: {
                    status: "ACTIVE"
                }
            })

        ]);
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