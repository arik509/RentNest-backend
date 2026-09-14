import jwt from "jsonwebtoken";

import { config } from "../config/index.js";


export const createAccessToken = (
    payload: object
) => {

    return jwt.sign(
        payload,
        config.jwt.accessSecret,
        {
            expiresIn: config.jwt.accessExpiresIn as jwt.SignOptions["expiresIn"]
        }
    );

};



export const createRefreshToken = (
    payload: object
) => {

    return jwt.sign(
        payload,
        config.jwt.refreshSecret,
        {
            expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"]
        }
    );

};