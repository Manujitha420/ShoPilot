import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'shopilot_super_secret_access_token_key_2026';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'shopilot_super_secret_refresh_token_key_2026';

export const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });

  const accessToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, accessSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, refreshSecret, { expiresIn: '7d' });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  return res.status(201).json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const accessToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, accessSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id, email: user.email }, refreshSecret, { expiresIn: '7d' });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  return res.json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  });
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret) as { id: string; email: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const newAccessToken = jwt.sign({ id: user.id, email: user.email, name: user.name }, accessSecret, { expiresIn: '15m' });
    return res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }
};

export const me = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({ success: true, user });
};
