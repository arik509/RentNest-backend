const validateUpdateUserStatus = (
    body:Record<string, unknown>
):string[] => {

    if(
        body.status !== "ACTIVE" &&
        body.status !== "BLOCKED"
    ){
        return ["Status must be ACTIVE or BLOCKED"];
    }


    return [];
};


export const adminValidation = {
    validateUpdateUserStatus
};
