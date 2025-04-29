import { cheqd } from '@/lib/cheqd';
import crypto from 'crypto';

export interface DlrResponse {
  uri: string;
}

export async function pinDlr(agentDid: string, data: object): Promise<DlrResponse> {
  // Compute content hash
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify(data))
    .digest('hex');

    // Create DLR
    const res = await cheqd.drc.linkedResource.create({
      issuer: agentDid,
      data: {
        hash, ...data
      },
    });

    return { uri: res.uri};
}