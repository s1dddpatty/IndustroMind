import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    data: { id: "plant-1", name: "Plant Alpha" },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
