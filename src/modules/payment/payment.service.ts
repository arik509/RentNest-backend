import prisma from "../../lib/prisma.js";

import AppError from "../../errors/AppError.js";

import {
    PaymentProvider
} from "../../../generated/prisma/client.js";



interface PaymentPayload {

    rentalRequestId:string;

    amount:number;

    method:string;

    provider:PaymentProvider;

}



const createPayment = async(
    tenantId:string,
    payload:PaymentPayload
)=>{


    const rentalRequest =
        await prisma.rentalRequest.findUnique({

            where:{
                id:payload.rentalRequestId
            },

            include:{
                property:true
            }

        });



    if(!rentalRequest){

        throw new AppError(
            404,
            "Rental request not found"
        );

    }



    if(
        rentalRequest.tenantId !== tenantId
    ){

        throw new AppError(
            403,
            "You cannot pay for this request"
        );

    }



    if(
        rentalRequest.status !== "APPROVED"
    ){

        throw new AppError(
            400,
            "Rental request is not approved"
        );

    }



    const payment =
        await prisma.payment.create({

            data:{

                rentalRequestId:
                    payload.rentalRequestId,

                amount:
                    payload.amount,

                method:
                    payload.method,

                provider:
                    payload.provider,

                status:"COMPLETED",

                transactionId:
                    `TXN-${Date.now()}`,

                paidAt:
                    new Date()

            }

        });



    await prisma.rentalRequest.update({

        where:{
            id:payload.rentalRequestId
        },

        data:{
            status:"ACTIVE"
        }

    });



    return payment;

};





const getPaymentHistory = async(
    tenantId:string
)=>{


    return prisma.payment.findMany({

        where:{

            rentalRequest:{
                tenantId
            }

        },

        include:{

            rentalRequest:{
                include:{
                    property:true
                }
            }

        },


        orderBy:{
            createdAt:"desc"
        }

    });

};





const getPaymentById = async(
    tenantId:string,
    paymentId:string
)=>{


    const payment =
        await prisma.payment.findUnique({

            where:{
                id:paymentId
            },

            include:{
                rentalRequest:true
            }

        });



    if(!payment){

        throw new AppError(
            404,
            "Payment not found"
        );

    }



    if(
        payment.rentalRequest.tenantId
        !== tenantId
    ){

        throw new AppError(
            403,
            "You cannot access this payment"
        );

    }



    return payment;

};





export const paymentService = {

    createPayment,

    getPaymentHistory,

    getPaymentById

};