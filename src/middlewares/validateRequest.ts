import { Request, Response, NextFunction } from "express";

type Validator = (body: Record<string, unknown>) => string[];

const validateRequest =
    (validator: Validator) =>
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validator(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errorDetails: errors,
            });
        }

        next();
    };

export default validateRequest;