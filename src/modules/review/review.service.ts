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


    if(
        typeof payload.rating !== "number" ||
        !Number.isInteger(payload.rating) ||
        payload.rating < 1 ||
        payload.rating > 5
    ){

        throw new AppError(
            400,
            "Rating must be between 1 and 5"
        );

    }



    if(
        typeof payload.comment !== "string" ||
        !payload.comment ||
        payload.comment.trim().length === 0
    ){

        throw new AppError(
            400,
            "Comment is required"
        );

    }




    const property =

        await prisma.property.findUnique({

            where:{
                id:payload.propertyId.trim()
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
                    payload.propertyId.trim(),

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
                    payload.propertyId.trim()

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
                    payload.propertyId.trim(),

                rating:
                    payload.rating,

                comment:
                    payload.comment.trim()

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
