import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return users;
};
const updateUserStatus = async (userId, status) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
    if (!user) {
        throw new AppError(404, "User not found");
    }
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
        }
    });
    return updatedUser;
};
const getAllProperties = async () => {
    return prisma.property.findMany({
        include: {
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
const getAllRentals = async () => {
    return prisma.rentalRequest.findMany({
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            property: {
                include: {
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
export const adminService = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
};
