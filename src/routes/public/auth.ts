import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../../middleware/validate';
import { loginUser, registerUser } from '../../controllers/public/authController';
import { PASSWORD_REGEX } from '../../types';

const router = Router();

router.post('/register',
    [
        body('username')
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('Username must be between 3 and 50 characters'),
        body('password')
            .notEmpty().withMessage('Password is required')
            .matches(PASSWORD_REGEX).withMessage('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character')
    ],
    validate,
    registerUser);

router.post('/login',
    [
        body('username').trim().notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    validate,
    loginUser);

export default router;