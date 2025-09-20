import {  Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import config from "../config";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getTokenByUsername } from "../models/tokenModel";
import { getUserByUsername } from "../models/userModel";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Assuming Bearer token

    if (!token) {
        logger.warn({
            message: 'Token missing in Authorization header'
        });
        return res.status(401).json({ message: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload & { jti?: string };

        const userData = await getUserByUsername(decoded.username);
        if (!userData) {
            logger.warn(`Token verification failed: user not found for username ${decoded.username}`);
            return res.status(401).json({ message: 'Invalid token' });
        }

        const storedJti = await getTokenByUsername(decoded.username);

        if(!storedJti || storedJti !== decoded.jti) {
            logger.warn(`Token verification failed: token jti mismatch for username ${decoded.username}`);
            return res.status(401).json({ message: 'Invalid token' });
        }

        next();
    } catch (error) {
        logger.error({
            message: 'Token verification error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default verifyJWT;