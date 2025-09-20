import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { logger } from '../utils/logger';

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        logger.warn({
            message: 'Validation failed',
            errors: errors.array(),
            path: req.path,

        });

        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export default validate;