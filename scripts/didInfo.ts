import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { toMultibaseRaw }            from "@cheqd/sdk";

async function main() {
  // 1. Read your mnemonic from .env.local
  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic) {
    console.error("Error: MNEMONIC is not defined in .env.local");
    process.exit(1);
  }

  // 2. Restore a wallet with the 'cheqd' prefix
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
    prefix: "cheqd",
  });

  // 3. Get the first account
  const [account] = await wallet.getAccounts();
  const address = account.address;

  // 4. Derive the on-chain DID and the multibase-encoded public key
  const did = `did:cheqd:testnet:${address}`;
  const publicKeyMultibase = toMultibaseRaw(account.pubkey);

  // 5. Print out the values you need for DID registration and resource pinning
  console.log("ADDRESS:             ", address);
  console.log("DID:                 ", did);
  console.log("PUBLIC_KEY_MULTIBASE:", publicKeyMultibase);
}

main().catch((err) => {
  console.error("Script error:", err);
  process.exit(1);
});