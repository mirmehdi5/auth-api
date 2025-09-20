import { Router } from 'express';
import verifyJWT from '../../middleware/verifyJWT';
import { testEndpoint } from '../../controllers/lendesk/test';

const router = Router();

router.get('/test',
    verifyJWT,
    testEndpoint
)

export default router;