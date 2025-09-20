import { Request, Response } from 'express';
import { logger } from '../../utils/logger';

export const testEndpoint = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: 'Protected route accessed successfully' });
    } catch (error) {
        logger.error({
            message: 'Error accessing protected route',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        return res.status(500).json({ message: 'Internal Server Error' });
    }        
}