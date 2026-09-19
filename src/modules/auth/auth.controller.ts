import { Request, Response } from "express";

import { authService } from "./auth.service.js";

import sendResponse from "../../utils/sendResponse.js";

import { AuthRequest } from "../../middlewares/auth.js";
import AppError from "../../errors/AppError.js";


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


    res.cookie(
        "accessToken",
        result.accessToken,
        {
            httpOnly:true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:
                60 * 60 * 1000
        }
    );


    res.cookie(
        "refreshToken",
        result.refreshToken,
        {
            httpOnly:true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:
                7 * 24 * 60 * 60 * 1000
        }
    );


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"Login successful",
            data:{
                user:result.user
            }
        }
    );

};




const me = async(
    req:AuthRequest,
    res:Response
)=>{


    const result =
        await authService.getMe(
            req.user!.id
        );


    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"User retrieved successfully",
            data:result
        }
    );

};

const refreshToken = async(
    req:Request,
    res:Response
)=>{


    const token =
        req.cookies.refreshToken;



    if(!token){

        throw new AppError(
            401,
            "Refresh token missing"
        );

    }



    const result =
        await authService.refreshToken(token);



    res.cookie(
        "accessToken",
        result.accessToken,
        {
            httpOnly:true,
            secure:
                process.env.NODE_ENV === "production",
            sameSite:"lax",
            maxAge:
              60 * 60 * 1000
        }
    );



    sendResponse(
        res,
        {
            success:true,
            statusCode:200,
            message:"Access token refreshed successfully",
            data:null
        }
    );

};



export const authController = {

    register,

    login,

    me,

    refreshToken

};
