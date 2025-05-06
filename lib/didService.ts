import { MsgCreateDidDocEncodeObject } from '@cheqd/sdk';
import { cheqd } from '@/lib/cheqd';

export async function createDid(payload: MsgCreateDidDocEncodeObject["value"]) {
  return await cheqd.execute("did.createDidDoc", payload);
}