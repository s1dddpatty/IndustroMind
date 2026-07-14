import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    data: { token: "mock-jwt-token" },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
