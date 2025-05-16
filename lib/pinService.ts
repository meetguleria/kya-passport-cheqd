import fs from 'fs';
import { createResourceStudio } from '@/lib/cheqdStudio';

export async function pinResource(agentDid: string): Promise<string> {
  const data = JSON.parse(fs.readFileSync('resource.json', 'utf-8'));

  const { resourceURI } = await createResourceStudio(agentDid, data, 'resource.json', 'application/json');

  return resourceURI;
}