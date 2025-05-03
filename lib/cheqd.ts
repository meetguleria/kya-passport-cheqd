import { createCheqdSDK, CheqdNetwork } from "@cheqd/sdk";
import { DirectSecp256k1HdWallet }        from "@cosmjs/proto-signing";

/**
 * Initialize and build a CheqdSDK instance connected to testnet,
 * using the wallet restored from CHEQD_MNEMONIC.
 */
async function initCheqd() {
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.CHEQD_MNEMONIC!,
    { prefix: "cheqd" }
  );

  const cheqd = await createCheqdSDK({
    modules: [],                            // load all built-in modules
    rpcUrl:  "https://rpc.cheqd.network",   // testnet RPC
    network: CheqdNetwork.Testnet,          // use the Testnet chain
    wallet,                                 // Cosmos OfflineSigner
  });

  return cheqd;
}

// Export the initialized SDK client
export const cheqd = await initCheqd();