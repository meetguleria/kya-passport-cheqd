import { issueCredentialStudio } from "./cheqdStudio";

export async function issueVc(
  agentDid: string,
  subjectDid: string,
  claims: Record<string, any>
): Promise<{ jwt: string }> {
  // Delegate to Cheqd Studio to issue the Verifiable Credential JWT
  const { jwt } = await issueCredentialStudio(agentDid, subjectDid, claims);
  return { jwt };
}