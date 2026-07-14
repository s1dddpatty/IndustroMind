import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: { contradictions: [{ severity: "Critical", description: "Valve mismatch" }] },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
