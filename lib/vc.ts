import { issueFullCredentialStudio, FullVcResponse } from "./cheqdStudio";

export interface IssuedVc {
  jwt: string;
  credential: FullVcResponse;
}

export async function issueVc(
  agentDid: string,
  subjectDid: string,
  claims: Record<string, any>
): Promise<IssuedVc> {
  // Retrieve the full VC JSON
  const fullVc = await issueFullCredentialStudio(agentDid, subjectDid, claims);
  // Extract the nested JWT
  const jwt = fullVc.proof?.jwt;
  if (!jwt) {
    throw new Error("Did not receive JWT in VC proof");
  }
  return { jwt, credential: fullVc };
}