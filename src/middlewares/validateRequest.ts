import { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError.js";

type Validator = (body: Record<string, unknown>) => string[];

const validateRequest =
    (validator: Validator) =>
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validator(req.body ?? {});

        if (errors.length > 0) {
            return next(
                new AppError(
                    400,
                    errors.join(", ")
                )
            );
        }

        next();
    };

export default validateRequest;
