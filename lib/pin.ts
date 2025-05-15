import { getCheqdClient } from "@/lib/cheqd";
import crypto from "crypto";

export interface DlrResponse {
  transactionHash: string;
}

export async function pinDlr(agentDid: string, data: object): Promise<DlrResponse> {
  // 1. Get the Cheqd client
  const { cheqd } = await getCheqdClient();
  // 2. Compute a unique hash for the data
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(data))
    .digest("hex");

  // 3. Construct the payload for the createResource transaction
  const payload = {
    id: `${agentDid}#resource-${hash}`,
    content: JSON.stringify(data),
    contentType: "application/json",
  };

  // 4. Anchor the resource on-chain via the Cheqd SDK generic executor
  const tx = await cheqd.execute("resource.createResource", payload);

  // 5. Return the transaction hash for tracking
  return { transactionHash: tx.transactionHash };
}