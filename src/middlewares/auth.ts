import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import AppError from "../errors/AppError.js";
import { config } from "../config/index.js";
import prisma from "../lib/prisma.js";


export interface AuthRequest extends Request {

    user?: {
        id:string;
        role:string;
    }

}


const auth = async (
    req:AuthRequest,
    res:Response,
    next:NextFunction
)=>{


    const authorization =
        req.headers.authorization;


    const headerToken =
        authorization?.startsWith("Bearer ")
            ? authorization.slice(7)
            : authorization;


    const token =
        req.cookies.accessToken ||
        headerToken;



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


        const user =
            await prisma.user.findUnique({

                where:{
                    id:decoded.id
                },

                select:{
                    id:true,
                    role:true,
                    status:true
                }

            });


        if(!user){

            throw new AppError(
                401,
                "Invalid token"
            );

        }


        if(user.status === "BLOCKED"){

            throw new AppError(
                403,
                "Your account has been blocked"
            );

        }


        req.user = {
            id:user.id,
            role:user.role
        };


        next();


    } catch(error){


        if(error instanceof AppError){

            throw error;

        }

        throw new AppError(
            401,
            "Invalid token"
        );

    }

};


export default auth;
