import {
    Request,
    Response,
    NextFunction
} from "express";


import AppError from "../errors/AppError.js";

import { Prisma } from "../../generated/prisma/client.js";


const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {


    let statusCode = 500;

    let message = "Something went wrong";


    if(err instanceof AppError){

        statusCode = err.statusCode;

        message = err.message;

    }


    else if(
        err instanceof
        Prisma.PrismaClientKnownRequestError
    ){

        if(err.code === "P2002"){
            statusCode = 409;
            message = "A record with this value already exists";
        }

        else if(err.code === "P2025"){
            statusCode = 404;
            message = "Record not found";
        }

        else if(
            err.code === "P2003" ||
            err.code === "P2034"
        ){
            statusCode = 409;
            message = "Database operation conflict";
        }

        else{
            statusCode = 400;
            message = "Database request failed";
        }

    }


    else if(
        err instanceof
        Prisma.PrismaClientValidationError
    ){

        statusCode = 400;
        message = "Invalid data provided";

    }


    else{

        console.error(err);

    }


    res.status(statusCode).json({

        success:false,

        message,

        errorDetails:null

    });

};


export default globalErrorHandler;
