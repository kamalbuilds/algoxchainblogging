// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Solscribe } from '../target/types/solscribe';
import { IDL as SolscribeIDL } from '../target/types/solscribe';

// Re-export the generated IDL and type
export { Solscribe, SolscribeIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const SOLSCRIBE_PROGRAM_ID = new PublicKey(
  '4p1tduyH9SQLzmHgGHTxmeDa5QX1zdUEask4PbhYFerY'
);

// This is a helper function to get the program ID for the Solquill program depending on the cluster.
export function getSolscribeProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return SOLSCRIBE_PROGRAM_ID;
  }
}
