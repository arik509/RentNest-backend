import prisma from "../../lib/prisma.js";

import AppError from "../../errors/AppError.js";


interface ReviewPayload {

    propertyId:string;

    rating:number;

    comment:string;

}



const createReview = async(
    tenantId:string,
    payload:ReviewPayload
)=>{


    const property =
        await prisma.property.findUnique({

            where:{
                id:payload.propertyId
            }

        });



    if(!property){

        throw new AppError(
            404,
            "Property not found"
        );

    }



    const rental =
    await prisma.rentalRequest.findFirst({

        where:{

            tenantId,

            propertyId:
                payload.propertyId,

            status:"COMPLETED"

        }

    });



    if(!rental){

        throw new AppError(
            400,
            "You can review only after completing rental"
        );

    }



    const existingReview =
        await prisma.review.findFirst({

            where:{

                tenantId,

                propertyId:
                    payload.propertyId

            }

        });



    if(existingReview){

        throw new AppError(
            400,
            "You already reviewed this property"
        );

    }



    const review =
        await prisma.review.create({

            data:{

                tenantId,

                propertyId:
                    payload.propertyId,

                rating:
                    payload.rating,

                comment:
                    payload.comment

            }

        });



    return review;

};





const getPropertyReviews = async(
    propertyId:string
)=>{


    return prisma.review.findMany({

        where:{
            propertyId
        },

        include:{

            tenant:{
                select:{
                    name:true
                }
            }

        },


        orderBy:{
            createdAt:"desc"
        }

    });

};





export const reviewService = {

    createReview,

    getPropertyReviews

};