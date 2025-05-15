import { createCheqdSDK, CheqdNetwork, DIDModule, ResourceModule, FeemarketModule, FeeabstractionModule } from "@cheqd/sdk";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

/** Returns a cached Cheqd SDK client and wallet. */
let cached: { cheqd: Awaited<ReturnType<typeof createCheqdSDK>>; wallet: DirectSecp256k1HdWallet } | null = null;

export async function getCheqdClient() {
  if (cached) return cached;

  // 1. Restore wallet from mnemonic
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.MNEMONIC!,
    { prefix: "cheqd" }
  );

  // 2. Initialize SDK with no modules to get signer + querier
  const partial = await createCheqdSDK({
    modules: [],
    rpcUrl: process.env.CHEQD_RPC_URL || "https://rpc.cheqd.network",
    network: CheqdNetwork.Testnet,
    wallet,
  });

  // 3. Attach all required modules
  const modules = [
    new DIDModule(partial.signer, partial.querier),
    new ResourceModule(partial.signer, partial.querier),
    new FeemarketModule(partial.signer, partial.querier),
    new FeeabstractionModule(partial.signer, partial.querier),
  ];

  // 4. Rebuild the SDK with full functionality
  const cheqd = await createCheqdSDK({
    modules,
    rpcUrl: process.env.CHEQD_RPC_URL || "https://rpc.cheqd.network",
    network: CheqdNetwork.Testnet,
    wallet,
  });

  // Cache and return
  cached = { cheqd, wallet };
  return cached;
}