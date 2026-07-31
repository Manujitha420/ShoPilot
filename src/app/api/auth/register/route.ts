import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'shopilot_super_secret_access_token_key_2026';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'shopilot_super_secret_refresh_token_key_2026';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, firstName, lastName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'New User';
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: cleanEmail,
        password: hashedPassword,
        name: fullName,
      },
    });

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
    console.error('Auth API register error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Registration failed. Please try again.',
      },
      { status: 500 }
    );
  }
}
