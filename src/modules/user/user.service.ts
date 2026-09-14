import prisma from "../../lib/prisma.js";

import AppError from "../../errors/AppError.js";


const getMyProfile = async (
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
                status:true,

                profile:true
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



const updateProfile = async(
    userId:string,
    payload:{
        name?:string;
        phone?:string;
        address?:string;
        profilePhoto?:string;
        bio?:string;
    }
)=>{


    const {
        name,
        phone,
        address,
        profilePhoto,
        bio
    } = payload;



    const user =
        await prisma.user.update({

            where:{
                id:userId
            },

            data:{
                name,

                profile:{
                    upsert:{

                        create:{
                            phone,
                            address,
                            profilePhoto,
                            bio
                        },

                        update:{
                            phone,
                            address,
                            profilePhoto,
                            bio
                        }

                    }
                }
            },

            select:{
                id:true,
                name:true,
                email:true,
                role:true,
                profile:true
            }

        });



    return user;

};



export const userService = {

    getMyProfile,

    updateProfile

};