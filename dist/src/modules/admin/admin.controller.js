import { adminService } from "./admin.service.js";
import sendResponse from "../../utils/sendResponse.js";
const getAllUsers = async (req, res) => {
    const result = await adminService.getAllUsers();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Users retrieved successfully",
        data: result
    });
};
const updateUserStatus = async (req, res) => {
    const id = req.params.id;
    const result = await adminService.updateUserStatus(id, req.body.status);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User status updated successfully",
        data: result
    });
};
const getAllProperties = async (req, res) => {
    const result = await adminService.getAllProperties();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Properties retrieved successfully",
        data: result,
    });
};
const getAllRentals = async (req, res) => {
    const result = await adminService.getAllRentals();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Rental requests retrieved successfully",
        data: result,
    });
};
export const adminController = {
    getAllUsers,
    updateUserStatus,
    getAllProperties,
    getAllRentals,
};
