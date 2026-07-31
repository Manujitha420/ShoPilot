import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'shopilot_super_secret_access_token_key_2026';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'shopilot_super_secret_refresh_token_key_2026';

export async function POST(req: NextRequest) {
  try {
    const credentials = await req.json();
    const identifier = (credentials.username || credentials.email || '').trim().toLowerCase();
    const password = credentials.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: identifier } });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      accessSecret,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      refreshSecret,
      { expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id, expiresAt },
    });

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.email,
      firstName: user.name.split(' ')[0] || user.name,
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      gender: 'unspecified',
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
    };

    const response = NextResponse.json({
      success: true,
      user: userProfile,
      token: accessToken,
      accessToken,
      refreshToken,
    });

    response.cookies.set({
      name: 'shopilot_token',
      value: accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Auth API login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Login failed.',
      },
      { status: 500 }
    );
  }
}
