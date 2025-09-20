import { Router } from 'express';
import authRouter from './public/auth';
import testRouter from './lendesk/test';

const router = Router();

router.use('/auth', authRouter);
router.use('/lendesk', testRouter);

export default router;