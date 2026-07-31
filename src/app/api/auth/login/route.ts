import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'shopilot_super_secret_access_token_key_2026';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'shopilot_super_secret_refresh_token_key_2026';

const DEMO_USERS: Record<string, { email: string; name: string; pass: string }> = {
  'emily.johnson@x.dummyjson.com': { email: 'emily.johnson@x.dummyjson.com', name: 'Emily Johnson', pass: 'emilyspass' },
  'emilys': { email: 'emily.johnson@x.dummyjson.com', name: 'Emily Johnson', pass: 'emilyspass' },
  'michael.williams@x.dummyjson.com': { email: 'michael.williams@x.dummyjson.com', name: 'Michael Williams', pass: 'michaelwpass' },
  'michaelw': { email: 'michael.williams@x.dummyjson.com', name: 'Michael Williams', pass: 'michaelwpass' },
};

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

    let user = await prisma.user.findUnique({ where: { email: identifier } });

    // Auto-seed demo account if it doesn't exist in database yet
    if (!user && DEMO_USERS[identifier]) {
      const demoInfo = DEMO_USERS[identifier];
      if (password === demoInfo.pass) {
        const hashedPassword = await bcrypt.hash(demoInfo.pass, 10);
        user = await prisma.user.upsert({
          where: { email: demoInfo.email },
          update: {},
          create: {
            email: demoInfo.email,
            password: hashedPassword,
            name: demoInfo.name,
          },
        });
      }
    }

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
