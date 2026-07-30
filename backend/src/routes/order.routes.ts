import { Router } from 'express';
import { createOrder, getOrders, getOrderById, createOrderSchema } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticateToken);

router.post('/', validateBody(createOrderSchema), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;
