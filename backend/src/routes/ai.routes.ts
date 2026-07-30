import { Router } from 'express';
import { handleAiProxy } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticateToken, handleAiProxy);

export default router;
