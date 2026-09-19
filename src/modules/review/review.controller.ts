import { Request, Response } from "express";

import { AuthRequest } from "../../middlewares/auth.js";

import { reviewService } from "./review.service.js";

import sendResponse from "../../utils/sendResponse.js";






const createReview = async(

    req:AuthRequest,

    res:Response

)=>{


    const result =

        await reviewService.createReview(

            req.user!.id,

            req.body

        );





    sendResponse(

        res,

        {

            success:true,

            statusCode:201,

            message:"Review created successfully",

            data:result

        }

    );

};









const getPropertyReviews = async(

    req:Request,

    res:Response

)=>{


    const result =

        await reviewService.getPropertyReviews(

            req.params.propertyId as string

        );





    sendResponse(

        res,

        {

            success:true,

            statusCode:200,

            message:"Reviews retrieved successfully",

            data:result

        }

    );

};









export const reviewController = {

    createReview,

    getPropertyReviews

};