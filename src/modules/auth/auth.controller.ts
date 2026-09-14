import { Request, Response } from "express";

import { authService } from "./auth.service.js";

import sendResponse from "../../utils/sendResponse.js";


const register = async(
    req:Request,
    res:Response
)=>{


    const result =
        await authService.registerUser(
            req.body
        );


    sendResponse(res,{

        success:true,

        statusCode:201,

        message:"User registered successfully",

        data:result

    });


};



const login = async(
    req:Request,
    res:Response
)=>{


    const {
        email,
        password
    } = req.body;



    const result =
        await authService.loginUser(
            email,
            password
        );



    sendResponse(res,{

        success:true,

        statusCode:200,

        message:"Login successful",

        data:result

    });


};



export const authController = {

    register,

    login

};