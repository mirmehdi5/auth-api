import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { logger } from '../../utils/logger';
import { User } from '../../types';
import config from '../../config';
import { getUserByUsername, saveUser } from '../../models/userModel';
import { saveTokenForUser } from '../../models/tokenModel';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body as { username: string; password: string };

        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            logger.warn(`Registration attempt with existing username: ${username}`);
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser: User = { 
            username, 
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        await saveUser(username, newUser);

        logger.info(`User registered: ${username}`);
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error({
            message: 'Failed to create a new user',
            error: error instanceof Error ? error.message : 'Unknown error',
        });

        res.status(500).json({ error: 'Failed to create user' });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body as { username: string; password: string };

        const userData = await getUserByUsername(username);
        // Generic message to prevent user enumeration
        const validationErrorMessage = 'Invalid username or password';
        
        if (!userData) {
            logger.warn(`Login attempt with non-existing username: ${username}`);
            return res.status(401).json({ message: validationErrorMessage });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            logger.warn(`Invalid password attempt for username: ${username}`);
            return res.status(401).json({ message: validationErrorMessage });
        }

        const jti = crypto.randomUUID();
        const options: SignOptions = { expiresIn: config.jwtExpiration, jwtid: jti };
        const token = jwt.sign(
            { username: userData.username },
            config.jwtSecret,
            options
        );


        await saveTokenForUser(username, jti);
        logger.info(`User logged in: ${username}`);
        
        res.status(200).json({
            message: 'Authentication successful', 
            token 
        });
    } catch (error) {
        logger.error({
            message: 'Login failed',
            error: error instanceof Error ? error.message : 'Unknown error',
        });

        res.status(500).json({ error: 'Login failed' });
    }
}