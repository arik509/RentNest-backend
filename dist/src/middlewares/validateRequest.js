import AppError from "../errors/AppError.js";
const validateRequest = (validator) => (req, res, next) => {
    const errors = validator(req.body ?? {});
    if (errors.length > 0) {
        return next(new AppError(400, errors.join(", ")));
    }
    next();
};
export default validateRequest;
