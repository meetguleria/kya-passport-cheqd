import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentialStudio } from '@/lib/cheqdStudio';

// shared verification logic
async function doVerify(jwt: string) {
  try {
    const result = await verifyCredentialStudio(jwt);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Credential verification failed:', err);
    return NextResponse.json(
      { error: err.message || 'Verification Failed' },
      { status: 500 }
    );
  }
}

// POST handler: consumes JSON body { jwt }
export async function POST(request: NextRequest) {
  const { jwt } = await request.json();
  if (!jwt) {
    return NextResponse.json({ error: 'Missing jwt in body' }, { status: 400 });
  }
  return doVerify(jwt);
}

// GET handler: consumes query param ?jwt=
export async function GET(request: NextRequest) {
  const jwt = request.nextUrl.searchParams.get('jwt');
  if (!jwt) {
    return NextResponse.json({ error: 'Missing jwt in query' }, { status: 400 });
  }
  return doVerify(jwt);
}