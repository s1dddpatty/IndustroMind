import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({
    success: true,
    data: { edges: [{ id: "e1", source: "n1", target: "n2", type: "CONNECTED_TO" }] },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
