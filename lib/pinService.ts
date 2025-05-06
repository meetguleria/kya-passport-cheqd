import fs from 'fs';
import { cheqd } from '@/lib/cheqd';

/**
 * Reads resource.json, anchors it on-chain as a DID-Linked Resource,
 * and returns the resulting transaction hash.
 *
 * @param agentDid - The DID under which to pin the resource.
 */
export async function pinResource(agentDid: string): Promise<string> {
  const raw = fs.readFileSync('resource.json');
  const content = raw.toString('base64');

  const payload = {
    id: `${agentDid}#res-1`,
    content,
    contentType: 'application/json',
  };

  const tx = await cheqd.execute('resource.createResource', payload);
  return tx.transactionHash;
}