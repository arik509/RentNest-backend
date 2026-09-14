import { Router } from "express";

import auth from "../../middlewares/auth.js";

import role from "../../middlewares/role.js";

import { paymentController } from "./payment.controller.js";


const router = Router();



router.post(
    "/create",
    auth,
    role("TENANT"),
    paymentController.createPayment
);



router.get(
    "/history",
    auth,
    role("TENANT"),
    paymentController.getPaymentHistory
);



router.get(
    "/:id",
    auth,
    role("TENANT"),
    paymentController.getPaymentById
);



export default router;