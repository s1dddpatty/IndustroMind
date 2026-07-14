import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: { nodes: [{ id: "n1", label: "Equipment", properties: { name: "Pump A" } }] },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
