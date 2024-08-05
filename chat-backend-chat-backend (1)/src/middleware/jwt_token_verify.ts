import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.body.token || req.query.token;

    if (token) {
        try {
            if (process.env.JWT_TOKEN) {
                const decoded = jwt.verify(token, process.env.JWT_TOKEN);
                req.body['user'] = decoded;
                return next();
            } else {
                res.status(500).send({ success: false, msg: "JWT secret key is not defined" });
            }
        } catch (error) {
            res.status(401).send({ success: false, msg: "Invalid Token" });
        }
    } else {
        res.status(401).send({ success: false, msg: "A token is required for authorization" });
    }
};
