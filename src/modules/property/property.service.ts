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
                id:payload.categoryId
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

                ...payload,

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



    const updatedProperty =
        await prisma.property.update({

            where:{
                id:propertyId
            },


            data:payload

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



    const properties =
        await prisma.property.findMany({

            where:{

                availabilityStatus:"AVAILABLE",


                ...(location && {
                    location:{
                        contains:location,
                        mode:"insensitive"
                    }
                }),


                ...(propertyType && {
                    propertyType
                }),


                ...(minPrice && maxPrice && {
                    price:{
                        gte:Number(minPrice),
                        lte:Number(maxPrice)
                    }
                }),


                ...(amenities && {
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
        await prisma.property.findUnique({

            where:{
                id
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