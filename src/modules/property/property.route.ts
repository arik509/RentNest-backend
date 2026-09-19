import { Router } from "express";

import auth from "../../middlewares/auth.js";

import role from "../../middlewares/role.js";

import { propertyController } from "./property.controller.js";

import validateRequest from "../../middlewares/validateRequest.js";

import { propertyValidation } from "./property.validation.js";


const router = Router();



router.post(
    "/landlord/properties",
    auth,
    role("LANDLORD"),
    validateRequest(
        propertyValidation.validateCreateProperty
    ),
    propertyController.createProperty
);



router.get(
    "/landlord/properties",
    auth,
    role("LANDLORD"),
    propertyController.getMyProperties
);



router.patch(
    "/landlord/properties/:id",
    auth,
    role("LANDLORD"),
    validateRequest(
        propertyValidation.validateUpdateProperty
    ),
    propertyController.updateProperty
);



router.delete(
    "/landlord/properties/:id",
    auth,
    role("LANDLORD"),
    propertyController.deleteProperty
);

router.get(
    "/properties",
    propertyController.getAllProperties
);


router.get(
    "/properties/:id",
    propertyController.getPropertyById
);



export default router;
