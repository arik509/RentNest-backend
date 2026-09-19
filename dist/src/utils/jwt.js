import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
export const createAccessToken = (payload) => {
    return jwt.sign(payload, config.jwt.accessSecret, {
        expiresIn: config.jwt.accessExpiresIn
    });
};
export const createRefreshToken = (payload) => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn
    });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, config.jwt.accessSecret);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, config.jwt.refreshSecret);
};
