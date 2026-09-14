import { Router } from "express";

import auth from "../../middlewares/auth.js";

import role from "../../middlewares/role.js";

import { reviewController } from "./review.controller.js";


const router = Router();



router.post(
    "/",
    auth,
    role("TENANT"),
    reviewController.createReview
);



router.get(
    "/property/:propertyId",
    reviewController.getPropertyReviews
);



export default router;