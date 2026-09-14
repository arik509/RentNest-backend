import { Router } from "express";

import auth from "../../middlewares/auth.js";

import role from "../../middlewares/role.js";

import { rentalController } from "./rental.controller.js";


const router = Router();



router.post(
    "/",
    auth,
    role("TENANT"),
    rentalController.createRentalRequest
);



router.get(
    "/my-requests",
    auth,
    role("TENANT"),
    rentalController.getMyRentalRequests
);



router.get(
    "/landlord",
    auth,
    role("LANDLORD"),
    rentalController.getLandlordRequests
);



router.patch(
    "/:id/status",
    auth,
    role("LANDLORD"),
    rentalController.updateRequestStatus
);

router.patch(
    "/:id/complete",
    auth,
    role("LANDLORD"),
    rentalController.completeRentalRequest
);



export default router;