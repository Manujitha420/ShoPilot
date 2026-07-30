import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const addItemSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
  variant: z.string().optional().default('Standard / Default'),
});

export const updateItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const getCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const items = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return res.json({ success: true, items });
};

export const addItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { productId, quantity, variant } = req.body;

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });

  if (existingItem) {
    const updated = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
    return res.json({ success: true, item: updated });
  }

  const newItem = await prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity,
      variant,
    },
  });

  return res.status(201).json({ success: true, item: newItem });
};

export const updateItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { quantity } = req.body;

  const item = await prisma.cartItem.findFirst({
    where: { id, userId },
  });

  if (!item) {
    return res.status(404).json({ success: false, message: 'Cart item not found.' });
  }

  const updated = await prisma.cartItem.update({
    where: { id },
    data: { quantity },
  });

  return res.json({ success: true, item: updated });
};

export const removeItem = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const item = await prisma.cartItem.findFirst({
    where: { id, userId },
  });

  if (!item) {
    return res.status(404).json({ success: false, message: 'Cart item not found.' });
  }

  await prisma.cartItem.delete({ where: { id } });

  return res.json({ success: true, message: 'Item removed from cart.' });
};

export const clearCart = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  await prisma.cartItem.deleteMany({ where: { userId } });

  return res.json({ success: true, message: 'Cart cleared successfully.' });
};
