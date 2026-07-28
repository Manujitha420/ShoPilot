import { NextRequest, NextResponse } from 'next/server';
import authService from '@/services/auth.service';

export async function POST(req: NextRequest) {
  try {
    const credentials = await req.json();

    if (!credentials.username || !credentials.password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const data = await authService.login(credentials);
    const { token, ...userProfile } = data;

    const response = NextResponse.json({
      success: true,
      user: userProfile,
      token,
    });

    // Set HttpOnly, Secure, SameSite cookie for session management
    response.cookies.set({
      name: 'shopilot_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours expiry
    });

    return response;
  } catch (error: any) {
    console.error('Auth API login error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed.',
      },
      { status: 401 }
    );
  }
}
