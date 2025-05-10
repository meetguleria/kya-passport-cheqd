import { NextRequest, NextResponse } from "next/server";
import { pinResource } from "@/lib/pinService";

export async function POST(request: NextRequest) {
  try {
    const { agentDid } = await request.json();
    const txHash = await pinResource(agentDid);
    return NextResponse.json({ txHash });
  } catch (err: any) {
    return new NextResponse(err.message || "Pin failed", { status: 500 });
  }
}