import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmailOrUsername, registerUserInStore, StoredUser } from '@/lib/userStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, username, firstName, lastName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const existingUser = findUserByEmailOrUsername(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists.' },
        { status: 400 }
      );
    }

    const fullName = name || `${firstName || ''} ${lastName || ''}`.trim() || 'New User';
    const computedUsername = username || email.split('@')[0];
    const id = `usr_${Date.now()}`;

    const newUser: StoredUser = {
      id,
      email: email.trim().toLowerCase(),
      name: fullName,
      username: computedUsername,
      password,
      firstName: fullName.split(' ')[0] || fullName,
      lastName: fullName.split(' ').slice(1).join(' ') || '',
      gender: 'unspecified',
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    };

    registerUserInStore(newUser);

    const token = `token_${id}_${Math.random().toString(36).substring(2)}`;

    const userProfile = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      gender: newUser.gender,
      image: newUser.image,
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
