import { Router } from "express";

import auth from "../../middlewares/auth.js";

import role from "../../middlewares/role.js";

import { propertyController } from "./property.controller.js";


const router = Router();



router.post(
    "/landlord/properties",
    auth,
    role("LANDLORD"),
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