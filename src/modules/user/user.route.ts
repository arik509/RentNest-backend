import { Router } from "express";

import auth from "../../middlewares/auth.js";

import { userController } from "./user.controller.js";


const router = Router();



router.get(
    "/me",
    auth,
    userController.getMyProfile
);



router.put(
    "/profile",
    auth,
    userController.updateProfile
);



export default router;