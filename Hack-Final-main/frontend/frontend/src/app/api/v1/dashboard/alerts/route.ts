import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: { alerts: [{ id: 1, type: "critical", message: "Pressure drop" }] },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
