import bcrypt from "bcrypt";

import prisma from "../../lib/prisma.js";

import AppError from "../../errors/AppError.js";

import {
    createAccessToken,
    createRefreshToken
} from "../../utils/jwt.js";

import { verifyRefreshToken } from "../../utils/jwt.js";


interface RegisterData {

    name:string;

    email:string;

    password:string;

    role:"TENANT" | "LANDLORD";

}



const registerUser = async (
    payload:RegisterData
)=>{


    if(
        payload.role !== "TENANT" &&
        payload.role !== "LANDLORD"
    ){

        throw new AppError(
            400,
            "Role must be TENANT or LANDLORD"
        );

    }


    const email = payload.email.trim().toLowerCase();


    const existingUser =
        await prisma.user.findUnique({
            where:{
                email
            }
        });


    if(existingUser){

        throw new AppError(
            400,
            "Email already exists"
        );

    }



    const hashedPassword =
        await bcrypt.hash(
            payload.password,
            10
        );



    const user =
        await prisma.user.create({

            data:{

                name:payload.name.trim(),

                email,

                password:hashedPassword,

                role:payload.role

            },

            select:{

                id:true,

                name:true,

                email:true,

                role:true,

                status:true

            }

        });



    return user;

};




const loginUser = async(
    email:string,
    password:string
)=>{


    const normalizedEmail =
        email.trim().toLowerCase();


    const user =
        await prisma.user.findUnique({
            where:{
                email:normalizedEmail
            }
        });



    if(!user){

        throw new AppError(
            401,
            "Invalid email or password"
        );

    }

    if(user.status === "BLOCKED"){

    throw new AppError(
        403,
        "Your account has been blocked"
    );

}



    const isPasswordMatch =
        await bcrypt.compare(
            password,
            user.password
        );



    if(!isPasswordMatch){

        throw new AppError(
            401,
            "Invalid email or password"
        );

    }



    const accessToken =
        createAccessToken({
            id:user.id,
            role:user.role
        });



    const refreshToken =
        createRefreshToken({
            id:user.id
        });



    return {

        accessToken,

        refreshToken,

        user:{
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role
        }

    };

};

const getMe = async(
    userId:string
)=>{


    const user =
        await prisma.user.findUnique({

            where:{
                id:userId
            },

            select:{
                id:true,
                name:true,
                email:true,
                role:true,
                status:true
            }

        });



    if(!user){

        throw new AppError(
            404,
            "User not found"
        );

    }


    return user;

};

const refreshToken = async(
    token:string
)=>{


    let decoded:{
        id:string;
    };


    try{

        decoded =
            verifyRefreshToken(token) as {
                id:string;
            };

    } catch(error){

        throw new AppError(
            401,
            "Invalid refresh token"
        );

    }


    if(
        !decoded.id ||
        typeof decoded.id !== "string"
    ){

        throw new AppError(
            401,
            "Invalid refresh token"
        );

    }



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
            404,
            "User not found"
        );

    }


    if(user.status === "BLOCKED"){

        throw new AppError(
            403,
            "Your account has been blocked"
        );

    }



    const newAccessToken =
        createAccessToken({

            id:user.id,

            role:user.role

        });



    return {
        accessToken:newAccessToken
    };

};



export const authService = {

    registerUser,

    loginUser,

    getMe,
    refreshToken

};

