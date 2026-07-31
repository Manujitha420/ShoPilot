import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const accessSecret = process.env.JWT_ACCESS_SECRET || 'shopilot_super_secret_access_token_key_2026';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      token = req.cookies.get('shopilot_token')?.value || null;
    }

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const decoded = jwt.verify(token, accessSecret) as { id: string; email: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

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

    return NextResponse.json({
      authenticated: true,
      success: true,
      user: userProfile,
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }
}
