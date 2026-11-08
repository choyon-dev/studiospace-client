import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'operational',
    service: 'StudioSpace Frontend Web Application',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
  });
}

