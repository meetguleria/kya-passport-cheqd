import { NextRequest, NextResponse } from "next/server";
import { createDidStudio } from "@/lib/cheqdStudio";

export async function POST(request: NextRequest) {
  try {
    // call Studio directly
    const { did, keys, transactionHash } = await createDidStudio();
    console.log("Create DID transactionHash:", transactionHash);
    return NextResponse.json({ did, keys, txHash: transactionHash });
  } catch (err: any) {
    console.error("DID creation failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create DID" },
      { status: 500 }
    );
  }
}