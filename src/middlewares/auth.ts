import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AppError from "../errors/AppError.js";
import { config } from "../config/index.js";


export interface AuthRequest extends Request {

    user?: {
        id:string;
        role:string;
    }

}


const auth = (
    req:AuthRequest,
    res:Response,
    next:NextFunction
)=>{


    const token =
        req.headers.authorization ||
    req.cookies.accessToken;



    if(!token){

        throw new AppError(
            401,
            "Authentication required"
        );

    }



    try {

        const decoded =
            jwt.verify(
                token,
                config.jwt.accessSecret
            ) as {
                id:string;
                role:string;
            };


        req.user = decoded;


        next();


    } catch(error){

        throw new AppError(
            401,
            "Invalid token"
        );

    }

};


export default auth;