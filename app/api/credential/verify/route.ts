import { NextRequest, NextResponse } from 'next/server';
import { verifyFullCredentialStudio, FullVcResponse } from '@/lib/cheqdStudio';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const { credential } = (await request.json()) as { credential?: FullVcResponse };
    if (!credential) {
      return NextResponse.json({ error: 'Missing credential in request body' }, { status: 400 });
    }

    console.log('🔍 Credential verification request payload:', credential);

    // Call the Studio verify endpoint for JSON‑LD credentials
    const result = await verifyFullCredentialStudio(credential);

    console.log('🔍 Cheqd verify result:', result);

    // Return the verification result
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Credential verification failed:', err);
    return NextResponse.json(
      { error: err.message || 'Verification failed' },
      { status: 500 }
    );
  }
}