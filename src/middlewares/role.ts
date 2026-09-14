import {
    Request,
    Response,
    NextFunction
} from "express";

import AppError from "../errors/AppError.js";


const role = (...allowedRoles:string[]) => {


    return (
        req:Request & {
            user?:{
                id:string;
                role:string;
            }
        },
        res:Response,
        next:NextFunction
    )=>{


        if(!req.user){

            throw new AppError(
                401,
                "Authentication required"
            );

        }



        if(
            !allowedRoles.includes(
                req.user.role
            )
        ){

            throw new AppError(
                403,
                "You do not have permission"
            );

        }



        next();

    };

};


export default role;