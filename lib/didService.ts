import { MsgCreateDidDocEncodeObject } from "@cheqd/sdk";
import { getCheqdClient } from '@/lib/cheqd';

export async function createDid(
  payload: MsgCreateDidDocEncodeObject["value"]
) {
  const { cheqd  } = await getCheqdClient();
  return cheqd.execute("did.createDidDoc", payload);
}