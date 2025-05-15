import fs from 'fs';
import { getCheqdClient } from '@/lib/cheqd';

export async function pinResource(agentDid: string): Promise<string> {
  const raw = fs.readFileSync('resource.json');
  const content = raw.toString('base64');

  const { cheqd } = await getCheqdClient();

  const payload = {
    id: `${agentDid}#res-1`,
    content,
    contentType: 'application/json',
  };

  const tx = await cheqd.execute('resource.createResource', payload);
  return tx.transactionHash;
}