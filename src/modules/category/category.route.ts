import { Router } from "express";

import auth from "../../middlewares/auth.js";

import role from "../../middlewares/role.js";

import { categoryController } from "./category.controller.js";


const router = Router();



router.get(
    "/",
    categoryController.getAllCategories
);



router.post(
    "/",
    auth,
    role("ADMIN"),
    categoryController.createCategory
);



router.patch(
    "/:id",
    auth,
    role("ADMIN"),
    categoryController.updateCategory
);



router.delete(
    "/:id",
    auth,
    role("ADMIN"),
    categoryController.deleteCategory
);



export default router;