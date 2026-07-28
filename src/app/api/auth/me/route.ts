import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('shopilot_token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  // Demo session token decoding / parsing
  if (token.startsWith('mock_jwt_token_emily')) {
    return NextResponse.json({
      authenticated: true,
      user: {
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://dummyjson.com/icon/emilys/128',
      },
    });
  }

  if (token.startsWith('mock_jwt_token_michael')) {
    return NextResponse.json({
      authenticated: true,
      user: {
        id: 2,
        username: 'michaelw',
        email: 'michael.williams@x.dummyjson.com',
        firstName: 'Michael',
        lastName: 'Williams',
        gender: 'male',
        image: 'https://dummyjson.com/icon/michaelw/128',
      },
    });
  }

  // Fallback active user session
  return NextResponse.json({
    authenticated: true,
    user: {
      id: 999,
      username: 'user',
      email: 'user@example.com',
      firstName: 'Authenticated',
      lastName: 'User',
      gender: 'unknown',
      image: 'https://dummyjson.com/icon/emilys/128',
    },
  });
}
