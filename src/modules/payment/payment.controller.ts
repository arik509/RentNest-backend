import { Response } from "express";

import { AuthRequest } from "../../middlewares/auth.js";

import { paymentService } from "./payment.service.js";

import sendResponse from "../../utils/sendResponse.js";



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
            message:"Payment completed successfully",
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





export const paymentController = {

    createPayment,

    getPaymentHistory,

    getPaymentById

};