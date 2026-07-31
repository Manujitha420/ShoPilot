import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('shopilot_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: 'usr_active',
      username: 'user',
      email: 'user@example.com',
      firstName: 'Authenticated',
      lastName: 'User',
      gender: 'unspecified',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User',
    },
  });
}
