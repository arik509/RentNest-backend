const validateCreateReview = (
    body:Record<string, unknown>
):string[] => {

    const errors:string[] = [];


    if(
        typeof body.propertyId !== "string" ||
        body.propertyId.trim().length === 0
    ){
        errors.push("propertyId is required");
    }


    if(
        typeof body.rating !== "number" ||
        !Number.isInteger(body.rating) ||
        body.rating < 1 ||
        body.rating > 5
    ){
        errors.push("Rating must be an integer between 1 and 5");
    }


    if(
        typeof body.comment !== "string" ||
        body.comment.trim().length === 0
    ){
        errors.push("Comment is required");
    }


    return errors;
};


export const reviewValidation = {
    validateCreateReview
};
