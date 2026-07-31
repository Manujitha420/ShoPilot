import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, firstName, lastName } = body;

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'New User';
    const id = `user_${Date.now()}`;

    const userProfile = {
      id,
      email: email || 'user@example.com',
      name: fullName,
      username: email ? email.split('@')[0] : 'user',
      firstName: fullName.split(' ')[0] || fullName,
      lastName: fullName.split(' ').slice(1).join(' ') || '',
      gender: 'unspecified',
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    };

    const token = `jwt_token_${id}_${Math.random().toString(36).substring(2)}`;
    const refreshToken = `refresh_token_${id}_${Math.random().toString(36).substring(2)}`;

    const response = NextResponse.json({
      success: true,
      user: userProfile,
      token,
      accessToken: token,
      refreshToken,
    });

    response.cookies.set({
      name: 'shopilot_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2,
    });

    return response;
  } catch (error: any) {
    console.error('Auth API register error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Registration failed.',
      },
      { status: 400 }
    );
  }
}
