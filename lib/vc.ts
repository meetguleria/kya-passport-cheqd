// lib/vc.ts
import { getCheqdClient } from "@/lib/cheqd";
import { createVerifiableCredentialJwt } from "did-jwt-vc";
import type { Signer } from "did-jwt";
import type { SignDoc } from "cosmjs-types/cosmos/tx/v1beta1/tx";

export async function issueVc(
  agentDid: string,
  subjectDid: string,
  claims: Record<string, any>
): Promise<{ jwt: string }> {
  const vcPayload = {
    sub: subjectDid,
    nbf: Math.floor(Date.now() / 1000),
    vc: {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential"],
      credentialSubject: claims,
    },
  };

  // Encoder for signing
  const encoder = new TextEncoder();

  // Get the cached Cheqd wallet
  const { wallet } = await getCheqdClient();

  // Get the signer address from the cached wallet
  const [account] = await wallet.getAccounts();
  const address = account.address;

  // Adapter: wrap wallet.signDirect in did-jwt-vc's Signer interface
  const signer: Signer = async (data: string | Uint8Array) => {
    const bytes = typeof data === "string"
      ? encoder.encode(data)
      : data;
    // Build a minimal SignDoc (sequence omitted)
    const signDoc: SignDoc = {
      bodyBytes: bytes,
      authInfoBytes: new Uint8Array(),
      chainId: "cheqd-testnet-1",
      accountNumber: BigInt(0),
    };

    const { signature } = await wallet.signDirect(address, signDoc as any);
    return signature.signature;
  };

  const issuer = { did: agentDid, signer };
  const jwt = await createVerifiableCredentialJwt(vcPayload as any, issuer);
  return { jwt };
}