import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  return NextResponse.json({
    success: true,
    data: { id: "org-1", name: "Acme Corp" },
    message: "Success",
    timestamp: new Date().toISOString()
  });
}
