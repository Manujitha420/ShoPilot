import { Router } from 'express';
import { getWishlist, addWishlistItem, removeWishlistItem, addWishlistSchema } from '../controllers/wishlist.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateBody } from '../middleware/validate.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getWishlist);
router.post('/items', validateBody(addWishlistSchema), addWishlistItem);
router.delete('/items/:productId', removeWishlistItem);

export default router;
