import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: { score: 85, highRiskExperts: ["John Doe"] },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
