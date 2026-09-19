import { userService } from "./user.service.js";
import sendResponse from "../../utils/sendResponse.js";
const getMyProfile = async (req, res) => {
    const result = await userService.getMyProfile(req.user.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile retrieved successfully",
        data: result
    });
};
const updateProfile = async (req, res) => {
    const result = await userService.updateProfile(req.user.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Profile updated successfully",
        data: result
    });
};
export const userController = {
    getMyProfile,
    updateProfile
};
