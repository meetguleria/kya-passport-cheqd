import { NextRequest, NextResponse } from 'next/server';
import { verifyFullCredentialStudio, FullVcResponse } from '@/lib/cheqdStudio';

// shared verification logic
async function doVerify(credential: FullVcResponse) {
  try {
    const result = await verifyFullCredentialStudio(credential);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Credential verification failed:', err);
    return NextResponse.json(
      { error: err.message || 'Verification Failed' },
      { status: 500 }
    );
  }
}

// POST handler: consumes JSON body { credential }
export async function POST(request: NextRequest) {
  const { credential } = (await request.json()) as { credential?: FullVcResponse };
  if (!credential) {
    return NextResponse.json({ error: 'Missing credential in body' }, { status: 400 });
  }
  return doVerify(credential);
}