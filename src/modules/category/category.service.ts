import prisma from "../../lib/prisma.js";

import AppError from "../../errors/AppError.js";


const createCategory = async(
    payload:{
        name:string;
        description?:string;
    }
)=>{


    const existingCategory =
        await prisma.category.findUnique({
            where:{
                name:payload.name.trim()
            }
        });



    if(existingCategory){

        throw new AppError(
            400,
            "Category already exists"
        );

    }



    const category =
        await prisma.category.create({

            data:{
                name:payload.name.trim(),
                description:payload.description
            }

        });



    return category;

};





const getAllCategories = async()=>{


    const categories =
        await prisma.category.findMany({

            orderBy:{
                createdAt:"desc"
            }

        });


    return categories;

};





const updateCategory = async(
    id:string,
    payload:{
        name?:string;
        description?:string;
    }
)=>{


    const category =
        await prisma.category.findUnique({

            where:{
                id
            }

        });



    if(!category){

        throw new AppError(
            404,
            "Category not found"
        );

    }



    return prisma.category.update({

        where:{
            id
        },

        data:{
            ...(payload.name !== undefined && {
                name:payload.name.trim()
            }),
            ...(payload.description !== undefined && {
                description:payload.description
            })
        }

    });

};





const deleteCategory = async(
    id:string
)=>{


    const category =
        await prisma.category.findUnique({

            where:{
                id
            },

            include:{
                properties:true
            }

        });



    if(!category){

        throw new AppError(
            404,
            "Category not found"
        );

    }



    if(category.properties.length > 0){

        throw new AppError(
            400,
            "Category has properties, cannot delete"
        );

    }



    await prisma.category.delete({

        where:{
            id
        }

    });


    return null;

};





export const categoryService = {

    createCategory,

    getAllCategories,

    updateCategory,

    deleteCategory

};
