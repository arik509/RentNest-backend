import { Router } from "express";

import { authController } from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { authValidation } from "./auth.validation.js";

const router = Router();

router.post(
    "/register",
    validateRequest(authValidation.validateRegister),
    authController.register
);

router.post(
    "/login",
    validateRequest(authValidation.validateLogin),
    authController.login
);

router.get(
    "/me",
    auth,
    authController.me
);

export default router;