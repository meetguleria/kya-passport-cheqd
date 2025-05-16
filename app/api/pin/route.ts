import { NextRequest, NextResponse } from "next/server";
import { createResourceStudio } from "@/lib/cheqdStudio";

export async function POST(request: NextRequest) {
  try {
    const { agentDid, data } = await request.json();
    const { resourceURI } = await createResourceStudio(
      agentDid,
      data,
      "ai-output.json",
      "application/json"
    );
    return NextResponse.json({ resourceURI });
  } catch (err: any) {
    console.error("Pin error:", err);
    return NextResponse.json(
      { error: err.message || "Pin failed" },
      { status: 500 }
    );
  }
}