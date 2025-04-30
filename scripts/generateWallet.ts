import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

async function main() {
  // Generate a mnemonic with cheqd prefix
  const wallet = await DirectSecp256k1HdWallet.generate(24, { prefix: "cheqd" });
  console.log("MNEMONIC:", wallet.mnemonic);

  // Get the first account address
  const [{ address }] = await wallet.getAccounts();
  console.log("ADDRESS: ", address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});