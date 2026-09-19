import { Router } from "express";

import auth from "../../middlewares/auth.js";

import { userController } from "./user.controller.js";

import validateRequest from "../../middlewares/validateRequest.js";

import { userValidation } from "./user.validation.js";


const router = Router();



router.get(
    "/me",
    auth,
    userController.getMyProfile
);



router.put(
    "/profile",
    auth,
    validateRequest(
        userValidation.validateUpdateProfile
    ),
    userController.updateProfile
);



export default router;
