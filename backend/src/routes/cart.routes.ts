import { Router } from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart, addItemSchema, updateItemSchema } from '../controllers/cart.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getCart);
router.post('/items', validateBody(addItemSchema), addItem);
router.patch('/items/:id', validateBody(updateItemSchema), updateItem);
router.delete('/items/:id', removeItem);
router.delete('/', clearCart);

export default router;
