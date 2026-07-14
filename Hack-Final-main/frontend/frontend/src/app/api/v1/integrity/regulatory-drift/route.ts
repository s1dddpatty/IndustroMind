import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: { drifts: [{ regulation: "ISO-14001", status: "outdated" }] },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
