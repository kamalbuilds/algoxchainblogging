
import { Connection, Transaction, Keypair } from '@solana/web3.js';
import { decode } from 'bs58';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    console.log("i m here");
    
    const PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY;

    const clusterApiUrl = (network: string) => {
      switch (network) {
        case 'mainnet':
          return 'https://api.mainnet-beta.solana.com';
        case 'testnet':
          return 'https://api.testnet.solana.com';
        case 'devnet':
        default:
          return 'https://api.devnet.solana.com';
      }
    };

    if(req.method == "POST"){
      console.log(PRIVATE_KEY,"pvtkey")

    try {
      console.log(req.body,"body", req);
      // @ts-ignore
      const { network, encodedTransaction } = await req.json();;

      console.log(network,encodedTransaction,"nexc")
      if (!PRIVATE_KEY) {
        throw new Error('Server private key is not set.');
      };

    
      const confirmTransactionFromBackend = async (network: string, encodedTransaction: string, privateKey: string) => {
        const connection = new Connection(clusterApiUrl(network), 'confirmed');
        const feePayer = Keypair.fromSecretKey(decode(privateKey));
        const wallet = new NodeWallet(feePayer);
        console.log(wallet,"wallet");
        console.log(feePayer,"feePayer");
        const recoveredTransaction = Transaction.from(
          Buffer.from(encodedTransaction, 'base64')
      );

      console.log(recoveredTransaction,"recoveredTransaction");
      
        // Sign the transaction
        const signedTx = await wallet.signTransaction(recoveredTransaction);
        console.log(signedTx,"signedTx");
        // Send the transaction
        const confirmTransaction = await connection.sendRawTransaction(
          signedTx.serialize()
        );

      return confirmTransaction;
      };

      const signature = await confirmTransactionFromBackend(network, encodedTransaction, PRIVATE_KEY);

      // return res.status(200).json({ signature });
      return new Response( JSON.stringify(signature) ,{ status:200 } )
    } catch (error) {
      console.error('Error signing transaction:', error);
      return new Response( JSON.stringify(error) ,{ status:500 } )
    }
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}
