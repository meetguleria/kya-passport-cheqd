import type { NextRequest } from 'next/server';
import { createDid } from '@/lib/didService';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const tx = await createDid(payload);
  return new Response(JSON.stringify({ txHash: tx.transactionHash }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}