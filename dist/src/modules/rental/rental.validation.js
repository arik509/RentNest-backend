const validateCreateRentalRequest = (body) => {
    const errors = [];
    if (typeof body.propertyId !== "string" ||
        body.propertyId.trim().length === 0) {
        errors.push("propertyId is required");
    }
    if (body.message !== undefined &&
        typeof body.message !== "string") {
        errors.push("message must be a string");
    }
    return errors;
};
const validateUpdateRequestStatus = (body) => {
    if (body.status !== "APPROVED" &&
        body.status !== "REJECTED") {
        return ["Status must be APPROVED or REJECTED"];
    }
    return [];
};
export const rentalValidation = {
    validateCreateRentalRequest,
    validateUpdateRequestStatus
};
