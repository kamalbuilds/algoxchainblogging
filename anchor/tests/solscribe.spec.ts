import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Solscribe } from '../target/types/solscribe';

describe('solscribe', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Solscribe as Program<Solscribe>;

  const solscribeKeypair = Keypair.generate();

  it('Initialize Solscribe', async () => {
    await program.methods
      .initialize()
      .accounts({
        solscribe: solscribeKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([solscribeKeypair])
      .rpc();

    const currentCount = await program.account.solscribe.fetch(
      solscribeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Solscribe', async () => {
    await program.methods
      .increment()
      .accounts({ solscribe: solscribeKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solscribe.fetch(
      solscribeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Solscribe Again', async () => {
    await program.methods
      .increment()
      .accounts({ solscribe: solscribeKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solscribe.fetch(
      solscribeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Solscribe', async () => {
    await program.methods
      .decrement()
      .accounts({ solscribe: solscribeKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solscribe.fetch(
      solscribeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set solscribe value', async () => {
    await program.methods
      .set(42)
      .accounts({ solscribe: solscribeKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.solscribe.fetch(
      solscribeKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the solscribe account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        solscribe: solscribeKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.solscribe.fetchNullable(
      solscribeKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
