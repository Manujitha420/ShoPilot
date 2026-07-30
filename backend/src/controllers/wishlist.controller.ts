import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const addWishlistSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
});

export const getWishlist = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, items });
};

export const addWishlistItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId } = req.body;

  const existing = await prisma.wishlistItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existing) {
    return res.json({ success: true, item: existing });
  }

  const item = await prisma.wishlistItem.create({
    data: { userId, productId },
  });

  return res.status(201).json({ success: true, item });
};

export const removeWishlistItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID' });
  }

  await prisma.wishlistItem.deleteMany({
    where: { userId, productId },
  });

  return res.json({ success: true, message: 'Item removed from wishlist.' });
};
