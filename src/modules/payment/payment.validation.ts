const validateCreatePayment = (
    body:Record<string, unknown>
):string[] => {

    const errors:string[] = [];


    if(
        typeof body.rentalRequestId !== "string" ||
        body.rentalRequestId.trim().length === 0
    ){
        errors.push("rentalRequestId is required");
    }


    if(body.method !== "card"){
        errors.push("Payment method must be card");
    }


    return errors;
};


export const paymentValidation = {
    validateCreatePayment
};
