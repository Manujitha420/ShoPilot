import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });

  // Delete HttpOnly session cookie
  response.cookies.set({
    name: 'shopilot_token',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
