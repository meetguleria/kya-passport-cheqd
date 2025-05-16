import { NextRequest, NextResponse } from 'next/server';
import { runAgent } from '@/lib/agent';

export async function POST(request: NextRequest) {
  const { prompt } = await request.json();
  const result = await runAgent(prompt);
  return NextResponse.json(result);
}