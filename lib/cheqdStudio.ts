import { Buffer } from 'buffer';
const BASE = process.env.CHEQD_STUDIO_URL!;
const KEY = process.env.CHEQD_API_KEY!;

async function studioPost<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    let errMsg: string;
    try {
      const errJson = JSON.parse(errText);
      errMsg = errJson.error || JSON.stringify(errJson);
    } catch {
      errMsg = errText;
    }
    throw new Error(`Studio API ${res.status}: ${errMsg}`);
  }
  return res.json() as Promise<T>;
}

// Create DID on testnet
export async function createDidStudio() {
  return studioPost<{
    did: string,
    keys: Array<{ kid: string; publicKeyHex: string; controller: string }>;
  }>('/did/create', {
    network: 'testnet',
    identifierFormatType: 'uuid',
    verificationMethodType: 'Ed25519VerificationKey2018',
  });
}

// Anchor JSON object as a DID-Linked Resource
export async function createResourceStudio(
  did: string,
  data: object,
  name: string,
  type: string,
) {
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
  return studioPost<{
    resourceURI: string;
    resourceId: string;
  }>(`/resource/create/${did}`, {
    data: encoded,
    encoding: 'base64',
    name,
    type,
  });
}

// Issue a verifiable Credential jwt
export async function issueCredentialStudio(
  issuerDid: string,
  subjectDid: string,
  attributes: Record<string, any>,
) {
  return studioPost<{ jwt: string }>(`/credential/issue`, {
    issuerDid,
    subjectDid,
    attributes,
    format: 'jwt',
  });
}