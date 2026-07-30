import { Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export const createOrderSchema = z.object({
  shippingAddress: z.string().min(5, 'Shipping address is required'),
  items: z.array(
    z.object({
      productId: z.number().int(),
      title: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      thumbnail: z.string().optional(),
    })
  ).min(1, 'Order must contain at least one item'),
});

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { shippingAddress, items } = req.body;

  const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 150 ? 0 : 9.99;
  const totalAmount = subtotal + tax + shipping;

  const order = await prisma.order.create({
    data: {
      userId,
      shippingAddress,
      subtotal,
      tax,
      shipping,
      totalAmount,
      status: 'PAID',
      items: {
        create: items.map((item: any) => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.thumbnail || '',
        })),
      },
    },
    include: { items: true },
  });

  // Clear user's cart upon successful checkout
  await prisma.cartItem.deleteMany({ where: { userId } });

  return res.status(201).json({ success: true, order });
};

export const getOrders = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  return res.json({
    success: true,
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getOrderById = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: true },
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  return res.json({ success: true, order });
};
