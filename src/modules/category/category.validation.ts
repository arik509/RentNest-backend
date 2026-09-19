const validateCategory = (
    body:Record<string, unknown>,
    partial:boolean
):string[] => {

    const errors:string[] = [];
    const fields = Object.keys(body);


    if(
        fields.some(field =>
            field !== "name" && field !== "description"
        )
    ){
        errors.push("Unsupported category fields provided");
    }


    if(
        partial &&
        !fields.includes("name") &&
        !fields.includes("description")
    ){
        errors.push("At least one category field is required");
    }


    if(!partial || fields.includes("name")){
        if(
            typeof body.name !== "string" ||
            body.name.trim().length === 0
        ){
            errors.push("Name is required");
        }
    }


    if(
        fields.includes("description") &&
        body.description !== undefined &&
        typeof body.description !== "string"
    ){
        errors.push("Description must be a string");
    }


    return errors;
};


export const categoryValidation = {
    validateCreateCategory:(body:Record<string, unknown>) =>
        validateCategory(body, false),
    validateUpdateCategory:(body:Record<string, unknown>) =>
        validateCategory(body, true)
};
