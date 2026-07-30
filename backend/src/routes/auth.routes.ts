import { Router } from 'express';
import { register, login, refresh, me, registerSchema, loginSchema, refreshSchema } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', validateBody(refreshSchema), refresh);
router.get('/me', authenticateToken, me);

export default router;
