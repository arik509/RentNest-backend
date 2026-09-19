const allowedFields = [
    "title",
    "description",
    "price",
    "location",
    "address",
    "propertyType",
    "bedrooms",
    "bathrooms",
    "amenities",
    "images",
    "categoryId"
];
const hasField = (body, field) => Object.prototype.hasOwnProperty.call(body, field);
const validateProperty = (body, partial) => {
    const errors = [];
    const unknownFields = Object.keys(body).filter(field => !allowedFields.includes(field));
    if (unknownFields.length > 0) {
        errors.push("Unsupported property fields provided");
    }
    if (partial &&
        !allowedFields.some(field => hasField(body, field))) {
        errors.push("At least one property field is required");
    }
    const stringFields = [
        "title",
        "description",
        "location",
        "address",
        "propertyType",
        "categoryId"
    ];
    for (const field of stringFields) {
        if (!partial || hasField(body, field)) {
            const value = body[field];
            if (typeof value !== "string" ||
                value.trim().length === 0) {
                errors.push(`${field} is required`);
            }
        }
    }
    if (!partial || hasField(body, "price")) {
        const price = body.price;
        if (typeof price !== "number" ||
            !Number.isFinite(price) ||
            price <= 0) {
            errors.push("Price must be greater than 0");
        }
    }
    for (const field of ["bedrooms", "bathrooms"]) {
        if (!partial || hasField(body, field)) {
            const value = body[field];
            if (typeof value !== "number" ||
                !Number.isInteger(value) ||
                value < 0) {
                errors.push(`${field} cannot be negative and must be an integer`);
            }
        }
    }
    for (const field of ["amenities", "images"]) {
        if (!partial || hasField(body, field)) {
            const value = body[field];
            if (!Array.isArray(value) ||
                !value.every(item => typeof item === "string")) {
                errors.push(`${field} must be an array of strings`);
            }
        }
    }
    return errors;
};
const validateCreateProperty = (body) => validateProperty(body, false);
const validateUpdateProperty = (body) => validateProperty(body, true);
export const propertyValidation = {
    validateCreateProperty,
    validateUpdateProperty
};
