import { Router } from "express";

import { authController } from "./auth.controller.js";
import auth from "../../middlewares/auth.js";
import validateRequest from "../../middlewares/validateRequest.js";
import { authValidation } from "./auth.validation.js";
import role from "../../middlewares/role.js";

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

router.post(
    "/refresh-token",
    authController.refreshToken
);

router.get(
    "/me",
    auth,
    authController.me
);

router.get(
    "/tenant-test",
    auth,
    role("TENANT"),
    (req,res)=>{

        res.json({
            message:"Tenant access granted"
        });

    }
);

export default router;