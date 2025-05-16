import { NextRequest, NextResponse } from 'next/server';
import { issueVc } from '@/lib/vc';

export async function POST(request: NextRequest) {
  try {
    const { agentDid, subjectDid, claims } = await request.json();
    console.log("VC issuance request:", { agentDid, subjectDid, claims });
    const { jwt } = await issueVc(agentDid, subjectDid, claims);
    console.log("VC issuance response:", { jwt });
    return NextResponse.json({ jwt });
  } catch (err: any) {
    return new NextResponse(err.message || 'VC issuance failed', { status: 500 });
  }
}