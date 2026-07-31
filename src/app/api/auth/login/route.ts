import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmailOrUsername } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  try {
    const credentials = await req.json();
    const identifier = credentials.username || credentials.email;
    const password = credentials.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Email/Username and password are required.' },
        { status: 400 }
      );
    }

    const user = findUserByEmailOrUsername(identifier);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' },
        { status: 401 }
      );
    }

    const token = `token_${user.id}_${Math.random().toString(36).substring(2)}`;
    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      image: user.image,
    };

    const response = NextResponse.json({
      success: true,
      user: userProfile,
      token,
      accessToken: token,
      refreshToken: `refresh_${token}`,
    });

    response.cookies.set({
      name: 'shopilot_token',
      value: token,
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
