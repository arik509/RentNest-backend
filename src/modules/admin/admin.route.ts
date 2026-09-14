import { Router } from "express";

import auth from "../../middlewares/auth.js";

import role from "../../middlewares/role.js";

import { adminController } from "./admin.controller.js";


const router = Router();



router.get(
    "/users",
    auth,
    role("ADMIN"),
    adminController.getAllUsers
);



router.patch(
    "/users/:id",
    auth,
    role("ADMIN"),
    adminController.updateUserStatus
);



export default router;