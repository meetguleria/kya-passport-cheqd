import { CheqdSDK, CheqdNetwork } from "@cheqd/sdk";

// Initialize Cheqd SDK
export const cheqd = new CheqdSDK({
  network: CheqdNetwork.Testnet,
  mnemonic: process.env.CHEQD_MNEMONIC!,
});

export const agentDid = await cheqd.did.create("Ed25519");