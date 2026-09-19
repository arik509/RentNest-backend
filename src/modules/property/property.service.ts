import prisma from "../../lib/prisma.js";

import AppError from "../../errors/AppError.js";



interface PropertyPayload {

    title:string;

    description:string;

    price:number;

    location:string;

    address:string;

    propertyType:string;

    bedrooms:number;

    bathrooms:number;

    amenities:string[];

    images:string[];

    categoryId:string;

}




const createProperty = async(
    userId:string,
    payload:PropertyPayload
)=>{


    const category =
        await prisma.category.findUnique({

            where:{
                id:payload.categoryId.trim()
            }

        });



    if(!category){

        throw new AppError(
            404,
            "Category not found"
        );

    }



    const property =
        await prisma.property.create({

            data:{
                title:payload.title.trim(),
                description:payload.description.trim(),
                price:payload.price,
                location:payload.location.trim(),
                address:payload.address.trim(),
                propertyType:payload.propertyType.trim(),
                bedrooms:payload.bedrooms,
                bathrooms:payload.bathrooms,
                amenities:payload.amenities,
                images:payload.images,
                categoryId:payload.categoryId.trim(),
                landlordId:userId

            }

        });



    return property;

};





const getMyProperties = async(
    userId:string
)=>{


    const properties =
        await prisma.property.findMany({

            where:{
                landlordId:userId
            },


            include:{
                category:true
            },


            orderBy:{
                createdAt:"desc"
            }

        });



    return properties;

};





const updateProperty = async(
    userId:string,
    propertyId:string,
    payload:Partial<PropertyPayload>
)=>{


    const property =
        await prisma.property.findUnique({

            where:{
                id:propertyId
            }

        });



    if(!property){

        throw new AppError(
            404,
            "Property not found"
        );

    }



    if(property.landlordId !== userId){

        throw new AppError(
            403,
            "You cannot update this property"
        );

    }


    if(payload.categoryId){

        const category =
            await prisma.category.findUnique({
                where:{
                    id:payload.categoryId.trim()
                }
            });


        if(!category){

            throw new AppError(
                404,
                "Category not found"
            );

        }

    }


    const data:Partial<PropertyPayload> = {};


    if(payload.title !== undefined){
        data.title = payload.title.trim();
    }

    if(payload.description !== undefined){
        data.description = payload.description.trim();
    }

    if(payload.price !== undefined){
        data.price = payload.price;
    }

    if(payload.location !== undefined){
        data.location = payload.location.trim();
    }

    if(payload.address !== undefined){
        data.address = payload.address.trim();
    }

    if(payload.propertyType !== undefined){
        data.propertyType = payload.propertyType.trim();
    }

    if(payload.bedrooms !== undefined){
        data.bedrooms = payload.bedrooms;
    }

    if(payload.bathrooms !== undefined){
        data.bathrooms = payload.bathrooms;
    }

    if(payload.amenities !== undefined){
        data.amenities = payload.amenities;
    }

    if(payload.images !== undefined){
        data.images = payload.images;
    }

    if(payload.categoryId !== undefined){
        data.categoryId = payload.categoryId.trim();
    }



    const updatedProperty =
        await prisma.property.update({

            where:{
                id:propertyId
            },


            data

        });



    return updatedProperty;

};





const deleteProperty = async(
    userId:string,
    propertyId:string
)=>{


    const property =
        await prisma.property.findUnique({

            where:{
                id:propertyId
            }

        });



    if(!property){

        throw new AppError(
            404,
            "Property not found"
        );

    }



    if(property.landlordId !== userId){

        throw new AppError(
            403,
            "You cannot delete this property"
        );

    }



    await prisma.property.delete({

        where:{
            id:propertyId
        }

    });


    return null;

};

const getAllProperties = async(
    query:any
)=>{


    const {
        location,
        propertyType,
        minPrice,
        maxPrice,
        amenities
    } = query;


    const parsedMinPrice =
        minPrice !== undefined && minPrice !== ""
            ? Number(minPrice)
            : undefined;

    const parsedMaxPrice =
        maxPrice !== undefined && maxPrice !== ""
            ? Number(maxPrice)
            : undefined;


    if(
        (parsedMinPrice !== undefined &&
            (!Number.isFinite(parsedMinPrice) || parsedMinPrice < 0)) ||
        (parsedMaxPrice !== undefined &&
            (!Number.isFinite(parsedMaxPrice) || parsedMaxPrice < 0)) ||
        (parsedMinPrice !== undefined &&
            parsedMaxPrice !== undefined &&
            parsedMinPrice > parsedMaxPrice)
    ){

        throw new AppError(
            400,
            "Invalid price range"
        );

    }



    const properties =
        await prisma.property.findMany({

            where:{

                availabilityStatus:"AVAILABLE",


                ...(typeof location === "string" && location && {
                    location:{
                        contains:location,
                        mode:"insensitive"
                    }
                }),


                ...(typeof propertyType === "string" && propertyType && {
                    propertyType
                }),


                ...((parsedMinPrice !== undefined ||
                    parsedMaxPrice !== undefined) && {
                    price:{
                        ...(parsedMinPrice !== undefined && {
                            gte:parsedMinPrice
                        }),
                        ...(parsedMaxPrice !== undefined && {
                            lte:parsedMaxPrice
                        })
                    }
                }),


                ...(typeof amenities === "string" && amenities && {
                    amenities:{
                        has:amenities
                    }
                })

            },


            include:{

                category:true,

                landlord:{
                    select:{
                        id:true,
                        name:true
                    }
                }

            },


            orderBy:{
                createdAt:"desc"
            }

        });



    return properties;

};

const getPropertyById = async(
    id:string
)=>{


    const property =
        await prisma.property.findFirst({

            where:{
                id,
                availabilityStatus:"AVAILABLE"
            },


            include:{

                category:true,

                landlord:{
                    select:{
                        id:true,
                        name:true
                    }
                }

            }

        });



    if(!property){

        throw new AppError(
            404,
            "Property not found"
        );

    }


    return property;

};



export const propertyService = {

    createProperty,

    getMyProperties,

    updateProperty,

    deleteProperty,

    getAllProperties,

    getPropertyById

};
