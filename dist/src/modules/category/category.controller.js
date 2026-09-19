import { categoryService } from "./category.service.js";
import sendResponse from "../../utils/sendResponse.js";
const createCategory = async (req, res) => {
    const result = await categoryService.createCategory(req.body);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Category created successfully",
        data: result
    });
};
const getAllCategories = async (req, res) => {
    const result = await categoryService.getAllCategories();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Categories retrieved successfully",
        data: result
    });
};
const updateCategory = async (req, res) => {
    const result = await categoryService.updateCategory(req.params.id, req.body);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category updated successfully",
        data: result
    });
};
const deleteCategory = async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Category deleted successfully",
        data: null
    });
};
export const categoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
};
