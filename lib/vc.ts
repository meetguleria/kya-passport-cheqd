import { agentDid, cheqd } from '@lib/cheqd';
import { createVerifiableCredentialJwt } from 'did-jwt-vc';
import { Issuer } from 'did-jwt-vc';

const issuer: Issuer = {
  id: agentDid,
  signer: cheqd.did.keySigner(),
};

export async function issueVc(subject: string, model: string, dlrUri: string): Promise<VcResult> {
  const vcPayload = {
    sub: subject,
    credentialSubject: { model, dlr: dlrUri },
  };

  const jwt = await createVerifiableCredentialJwt(vcPayload, issuer);
  return { jwt };
}