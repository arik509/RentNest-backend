import { Request, Response } from "express";

import { adminService } from "./admin.service.js";

import sendResponse from "../../utils/sendResponse.js";



const getAllUsers = async(
    req:Request,
    res:Response
)=>{


    const result =
        await adminService.getAllUsers();


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"Users retrieved successfully",
            data:result
        }
    );

};



const updateUserStatus = async(
    req:Request,
    res:Response
)=>{


    const id = req.params.id as string;


    const result =
    await adminService.updateUserStatus(
        id,
        req.body.status
    );


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"User status updated successfully",
            data:result
        }
    );

};

const getAllProperties = async (
    req: Request,
    res: Response
) => {
    const result =
        await adminService.getAllProperties();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Properties retrieved successfully",
        data: result,
    });
};


const getAllRentals = async (
    req: Request,
    res: Response
) => {
    const result =
        await adminService.getAllRentals();

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rental requests retrieved successfully",
        data: result,
    });
};



export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
};