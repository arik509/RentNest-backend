import { propertyService } from "./property.service.js";
import sendResponse from "../../utils/sendResponse.js";
const createProperty = async (req, res) => {
    const result = await propertyService.createProperty(req.user.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Property created successfully",
        data: result
    });
};
const getMyProperties = async (req, res) => {
    const result = await propertyService.getMyProperties(req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Properties retrieved successfully",
        data: result
    });
};
const updateProperty = async (req, res) => {
    const result = await propertyService.updateProperty(req.user.id, req.params.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Property updated successfully",
        data: result
    });
};
const deleteProperty = async (req, res) => {
    await propertyService.deleteProperty(req.user.id, req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Property deleted successfully",
        data: null
    });
};
const getAllProperties = async (req, res) => {
    const result = await propertyService.getAllProperties(req.query);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Properties retrieved successfully",
        data: result
    });
};
const getPropertyById = async (req, res) => {
    const result = await propertyService.getPropertyById(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Property retrieved successfully",
        data: result
    });
};
export const propertyController = {
    createProperty,
    getMyProperties,
    updateProperty,
    deleteProperty,
    getAllProperties,
    getPropertyById
};
