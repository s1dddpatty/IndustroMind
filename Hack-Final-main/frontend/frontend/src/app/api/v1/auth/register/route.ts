import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    data: { user: { id: "1", email: "user@example.com" } },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
