import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
const createRentalRequest = async (tenantId, payload) => {
    const property = await prisma.property.findUnique({
        where: {
            id: payload.propertyId.trim()
        }
    });
    if (!property) {
        throw new AppError(404, "Property not found");
    }
    if (property.availabilityStatus !== "AVAILABLE") {
        throw new AppError(400, "Property is not available");
    }
    const request = await prisma.$transaction(async (transaction) => {
        const currentProperty = await transaction.property.findUnique({
            where: {
                id: payload.propertyId.trim()
            },
            select: {
                availabilityStatus: true
            }
        });
        if (!currentProperty ||
            currentProperty.availabilityStatus
                !== "AVAILABLE") {
            throw new AppError(400, "Property is not available");
        }
        const existingRequest = await transaction.rentalRequest.findFirst({
            where: {
                tenantId,
                propertyId: payload.propertyId.trim(),
                status: {
                    in: [
                        "PENDING",
                        "APPROVED",
                        "ACTIVE"
                    ]
                }
            }
        });
        if (existingRequest) {
            throw new AppError(400, "Rental request already exists");
        }
        return transaction.rentalRequest.create({
            data: {
                tenantId,
                propertyId: payload.propertyId.trim(),
                message: payload.message?.trim()
            },
            include: {
                property: true
            }
        });
    }, {
        isolationLevel: "Serializable"
    });
    return request;
};
const getMyRentalRequests = async (tenantId) => {
    return prisma.rentalRequest.findMany({
        where: {
            tenantId
        },
        include: {
            property: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};
const getLandlordRequests = async (landlordId) => {
    return prisma.rentalRequest.findMany({
        where: {
            property: {
                landlordId
            }
        },
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                }
            },
            property: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
};
const updateRequestStatus = async (landlordId, requestId, status) => {
    const request = await prisma.rentalRequest.findUnique({
        where: {
            id: requestId
        },
        include: {
            property: true
        }
    });
    if (!request) {
        throw new AppError(404, "Rental request not found");
    }
    if (request.property.landlordId
        !== landlordId) {
        throw new AppError(403, "You cannot update this request");
    }
    if (status !== "APPROVED" &&
        status !== "REJECTED") {
        throw new AppError(400, "Invalid rental request status");
    }
    if (request.status !== "PENDING") {
        throw new AppError(400, "Only pending rental requests can be approved or rejected");
    }
    const updatedRequest = await prisma.rentalRequest.updateMany({
        where: {
            id: requestId,
            status: "PENDING"
        },
        data: {
            status
        }
    });
    if (updatedRequest.count !== 1) {
        throw new AppError(409, "Rental request state changed");
    }
    return prisma.rentalRequest.findUnique({
        where: {
            id: requestId
        }
    });
};
const completeRentalRequest = async (landlordId, requestId) => {
    const request = await prisma.rentalRequest.findUnique({
        where: {
            id: requestId
        },
        include: {
            property: true
        }
    });
    if (!request) {
        throw new AppError(404, "Rental request not found");
    }
    if (request.property.landlordId
        !== landlordId) {
        throw new AppError(403, "You cannot complete this rental");
    }
    if (request.status !== "ACTIVE") {
        throw new AppError(400, "Only active rentals can be completed");
    }
    const updatedRequestResult = await prisma.rentalRequest.updateMany({
        where: {
            id: requestId,
            status: "ACTIVE"
        },
        data: {
            status: "COMPLETED"
        }
    });
    if (updatedRequestResult.count !== 1) {
        throw new AppError(409, "Rental request state changed");
    }
    const updatedRequest = await prisma.rentalRequest.findUnique({
        where: {
            id: requestId
        }
    });
    return updatedRequest;
};
export const rentalService = {
    createRentalRequest,
    getMyRentalRequests,
    getLandlordRequests,
    updateRequestStatus,
    completeRentalRequest
};
