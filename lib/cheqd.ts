import { CheqdSDK, CheqdNetwork } from "@cheqd/sdk";
import { DirectSecp256k1HdWallet }      from "@cosmjs/proto-signing";

async function initCheqd() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.CHEQD_MNEMONIC!,
    { prefix: "cheqd" }
  );  // CosmJS wallet matches OfflineSigner 

  const cheqd = new CheqdSDK({
    network:       CheqdNetwork.Testnet,
    rpcUrl:        "https://rpc.cheqd.network",
    signerProvider: () => wallet,
  });

  const agentDid = await cheqd.did.create("Ed25519");
  return { cheqd, agentDid };
}

export const { cheqd, agentDid } = await initCheqd();