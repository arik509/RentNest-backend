import { Response } from "express";

import { AuthRequest } from "../../middlewares/auth.js";

import { rentalService } from "./rental.service.js";

import sendResponse from "../../utils/sendResponse.js";



const createRentalRequest = async(
    req:AuthRequest,
    res:Response
)=>{


    const result =
        await rentalService.createRentalRequest(
            req.user!.id,
            req.body
        );


    sendResponse(
        res,
        {
            success:true,
            statusCode:201,
            message:"Rental request submitted successfully",
            data:result
        }
    );

};



const getMyRentalRequests = async(
    req:AuthRequest,
    res:Response
)=>{


    const result =
        await rentalService.getMyRentalRequests(
            req.user!.id
        );


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"Rental requests retrieved successfully",
            data:result
        }
    );

};



const getLandlordRequests = async(
    req:AuthRequest,
    res:Response
)=>{


    const result =
        await rentalService.getLandlordRequests(
            req.user!.id
        );


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"Rental requests retrieved successfully",
            data:result
        }
    );

};



const updateRequestStatus = async(
    req:AuthRequest,
    res:Response
)=>{


    const result =
        await rentalService.updateRequestStatus(
            req.user!.id,
            req.params.id as string,
            req.body.status
        );


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"Rental request updated successfully",
            data:result
        }
    );

};



export const rentalController = {

    createRentalRequest,

    getMyRentalRequests,

    getLandlordRequests,

    updateRequestStatus

};