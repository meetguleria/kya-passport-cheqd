import { NextRequest, NextResponse } from "next/server";
import { createDid } from "@/lib/didService";

export async function POST(request: NextRequest) {
  try {
    const { did, keys } = await createDid();
    return NextResponse.json({ did, keys });
  } catch (err: any) {
    console.error("DID creation failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create DID" },
      { status: 500 }
    );
  }
}