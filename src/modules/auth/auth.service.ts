import bcrypt from "bcrypt";

import prisma from "../../lib/prisma.js";

import AppError from "../../errors/AppError.js";

import {
    createAccessToken,
    createRefreshToken
} from "../../utils/jwt.js";

import {
    verifyRefreshToken,
    verifyAccessToken
} from "../../utils/jwt.js";


interface RegisterData {

    name:string;

    email:string;

    password:string;

    role:"TENANT" | "LANDLORD";

}



const registerUser = async (
    payload:RegisterData
)=>{


    const existingUser =
        await prisma.user.findUnique({
            where:{
                email:payload.email
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

                name:payload.name,

                email:payload.email,

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


    const user =
        await prisma.user.findUnique({
            where:{
                email
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



    const isPasswordMatch =
        await bcrypt.compare(
            password,
            user.password
        );



    if(!isPasswordMatch){

        throw new AppError(
            401,
            "Invalid password"
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


    const decoded =
        verifyRefreshToken(token) as {
            id:string;
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
            404,
            "User not found"
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

