import { Buffer } from 'buffer';

export interface FullVcResponse {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: Record<string, any>;
  proof: {
    jwt: string;
    type?: string;
    created?: string;
    proofPurpose?: string;
    verificationMethod?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

//Response payload for createDidStudio()
export interface CreateDidResponse {
  did: string;
  keys: Array<{ kid: string; publicKeyHex: string; controller: string }>;
}

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
  return studioPost<CreateDidResponse>('/did/create', {
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
): Promise<{ jwt: string }> {
  // Call Studio, expecting the full VC JSON
  const fullVc = await studioPost<FullVcResponse>(`/credential/issue`, {
    issuerDid,
    subjectDid,
    attributes,
    format: 'jwt',
  });
  // Ensure proof.jwt is present
  if (!fullVc.proof?.jwt) {
    throw new Error('No JWT in VC proof');
  }
  return { jwt: fullVc.proof.jwt };
}

// Verify a JWT-formatted Verifiable Credential
export async function verifyCredentialStudio(
  jwt: string
): Promise<{ valid: boolean; errors?: any[]; payload?: any }> {
  return studioPost<{
    valid: boolean;
    errors?: any[];
    payload?: any;
  }>(
    `/credential/verify`,
    {
      format: 'jwt',
      verifiableCredential: jwt
    }
  );
}

// Verify a full JSON-LD Verifiable Credential
export async function verifyFullCredentialStudio(
  credential: FullVcResponse
): Promise<{ valid: boolean; errors?: any[]; payload?: any }> {
  return studioPost<{
    valid: boolean;
    errors?: any[];
    payload?: any;
  }>(
    `/credential/verify`,
    {
      credential,
      format: 'json-ld',
    }
  );
}

// Issue and return the full Verifiable Credential JSON (including proof, contexts, etc.)
export async function issueFullCredentialStudio(
  issuerDid: string,
  subjectDid: string,
  attributes: Record<string, any>,
): Promise<FullVcResponse> {
  // Use format: 'json-ld' to get the full JSON-LD credential, not just the JWT.
  return studioPost<FullVcResponse>(`/credential/issue`, {
    issuerDid,
    subjectDid,
    attributes,
    format: 'json-ld',
  });
}