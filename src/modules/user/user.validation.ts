const profileFields = [
    "name",
    "phone",
    "address",
    "profilePhoto",
    "bio"
];


const validateUpdateProfile = (
    body:Record<string, unknown>
):string[] => {

    const errors:string[] = [];


    if(
        Object.keys(body).length === 0
    ){
        errors.push("At least one profile field is required");
    }


    if(
        Object.keys(body).some(field =>
            !profileFields.includes(field)
        )
    ){
        errors.push("Unsupported profile fields provided");
    }


    for(const field of profileFields){

        if(
            Object.prototype.hasOwnProperty.call(body, field) &&
            typeof body[field] !== "string"
        ){
            errors.push(`${field} must be a string`);
        }

    }


    if(
        body.name !== undefined &&
        (
            typeof body.name !== "string" ||
            body.name.trim().length === 0
        )
    ){
        errors.push("Name cannot be empty");
    }


    return errors;
};


export const userValidation = {
    validateUpdateProfile
};
