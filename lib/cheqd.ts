// lib/cheqd.ts
import { createCheqdSDK, CheqdNetwork } from "@cheqd/sdk";
import { DirectSecp256k1HdWallet }      from "@cosmjs/proto-signing";

export async function initCheqd() {
  // Restore wallet from mnemonic
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.MNEMONIC!, { prefix: "cheqd" }
  );

  // Let the SDK load its default modules internally
  // (DID, Resource, Feemarket, Feeabstraction)
  // @ts-expect-error omitted modules array: SDK will load defaults internally
  const cheqd = await createCheqdSDK({
    rpcUrl:  "https://rpc.cheqd.network",
    network: CheqdNetwork.Testnet,
    wallet,
  });

  return { cheqd, wallet };
}