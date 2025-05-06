import { createCheqdSDK, CheqdNetwork } from "@cheqd/sdk";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

async function initCheqd() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.CHEQD_MNEMONIC!,
    { prefix: "cheqd" }
  );

  const cheqd = await createCheqdSDK({
    modules: [],                            // load built-in modules
    rpcUrl:  "https://rpc.cheqd.network",   // testnet RPC
    network: CheqdNetwork.Testnet,          // use the Testnet chain
    wallet,                                 // Cosmos OfflineSigner
  });

  return { cheqd, wallet };
}

// Export the initialized SDK client for use in services
export const { cheqd, wallet } = await initCheqd();