import prisma from "../../lib/prisma.js";

import AppError from "../../errors/AppError.js";


const createRentalRequest = async(
    tenantId:string,
    payload:{
        propertyId:string;
        message?:string;
    }
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


    if(property.availabilityStatus !== "AVAILABLE"){

        throw new AppError(
            400,
            "Property is not available"
        );

    }



    const request =
        await prisma.rentalRequest.create({

            data:{

                tenantId,

                propertyId:
                    payload.propertyId,

                message:
                    payload.message

            },

            include:{

                property:true

            }

        });


    return request;

};





const getMyRentalRequests = async(
    tenantId:string
)=>{


    return prisma.rentalRequest.findMany({

        where:{
            tenantId
        },

        include:{
            property:true
        },

        orderBy:{
            createdAt:"desc"
        }

    });

};





const getLandlordRequests = async(
    landlordId:string
)=>{


    return prisma.rentalRequest.findMany({

        where:{
            property:{
                landlordId
            }
        },

        include:{
            tenant:true,

            property:true

        },

        orderBy:{
            createdAt:"desc"
        }

    });

};





const updateRequestStatus = async(
    landlordId:string,
    requestId:string,
    status:
    "APPROVED"
    |
    "REJECTED"
)=>{


    const request =
        await prisma.rentalRequest.findUnique({

            where:{
                id:requestId
            },

            include:{
                property:true
            }

        });



    if(!request){

        throw new AppError(
            404,
            "Rental request not found"
        );

    }



    if(
        request.property.landlordId
        !== landlordId
    ){

        throw new AppError(
            403,
            "You cannot update this request"
        );

    }



    return prisma.rentalRequest.update({

        where:{
            id:requestId
        },

        data:{
            status
        }

    });

};





export const rentalService = {

    createRentalRequest,

    getMyRentalRequests,

    getLandlordRequests,

    updateRequestStatus

};