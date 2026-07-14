import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    data: { sessionId: "sess-1", nextQuestion: "What is the typical failure mode?" },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
