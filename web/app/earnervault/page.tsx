"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as multisig from "@sqds/multisig";
import { Keypair, LAMPORTS_PER_SOL, sendAndConfirmRawTransaction } from "@solana/web3.js";
import { PublicKey , sendAndConfirmTransaction } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import { toast} from "react-hot-toast";

export default function Index() {
  const { Permissions } = multisig.types; 
  const { multisigCreate } = multisig.instructions;
  const wallet = useWallet();
  const connection = useConnection();
  const [formData, setFormData] = useState({
    vaultName: "",
    nftCollectionAddress: "",
    walletAddresses: "",
    approvalThreshold: "",
  });
  
  const handleInputChange = (e : any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // @ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    toast.success("Creating Earner Vault");
    const latestBlockhash = await connection.connection.getLatestBlockhash();
    const blockhash = latestBlockhash.blockhash ; // Provide the blockhash
    const createKey = Keypair.generate();
    const pkey = createKey.publicKey;
    toast.success(pkey.toBase58());
    const [multisigPda] = multisig.getMultisigPda({
      createKey : pkey,
    });
    const creator = wallet.publicKey;
    const c = new PublicKey("4hWw4iKFjgbM2CrWmMCtomX4zaaugJiQWQxDSaYictT1");
    const configAuthority = null; // Provide the configAuthority's public key if applicable
    const threshold = parseInt(formData.approvalThreshold, 10);
    const members = [ {
      // Members Public Key
      key: creator,
      // Members permissions inside the multisig
      permissions: Permissions.all(),
   } ]; // Convert wallet addresses from formData.walletAddresses into an array of Members
    const timeLock = 0; 
  
    console.log(     
      "blockhash",
      blockhash,
      "createkey pkey",
      pkey,
      "creator",
      creator,
      "multisigPda",
      multisigPda,
      "configAuthority",
      configAuthority,
      "threshold ",   
      threshold,
      "timelock",
      timeLock,
      formData.vaultName);
    // Create the unsigned transaction
    
    const unsignedTransaction = multisigCreate({
      createKey: pkey,
      creator: c,
      multisigPda,
      configAuthority: configAuthority,
      threshold : 1,
      members : members as any,
      timeLock,
      memo: formData.vaultName,
    });
    
    const pkeyinstring = pkey.toBase58();

    console.log(unsignedTransaction , "unsignedTransaction" , pkeyinstring , "pkeyinstring" , c , "c" , creator , "creator" , multisigPda , "multisigPda" , configAuthority , "configAuthority" , threshold , "threshold" , members , "members" , timeLock , "timeLock" , formData.vaultName , "formData.vaultName")

    // sign your transaction with the required `Signers`
      
        // Sign the transaction with the creator's key and wallet
        const transaction = new Transaction().add(unsignedTransaction);
        transaction.recentBlockhash = (await connection.connection.getRecentBlockhash()).blockhash;
        const signedbycreatekey = transaction.sign(createKey);
        // @ts-ignore
        const signedTransaction = await wallet.signTransaction(transaction);
    
        console.log(signedTransaction , "signedTransaction", signedbycreatekey , transaction);
        // Create a transaction object and add the signed transaction
    
        // Send the transaction to the network
        try {
          const sig = await sendAndConfirmRawTransaction(connection.connection, signedTransaction.serialize());
          // const signature = await sendAndConfirmTransaction(connection, transaction, [wallet.publicKey, createKey]);
          console.log("Transaction confirmed. Signature:", sig);
        } catch (error) {
          console.error("Error sending transaction:", error);
        }
      };
  
  return (
    <>
        <form onSubmit={handleSubmit}>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Let's get started.</h1>
            <p className="text-gray-500">
              What is the name of your Vault? It's best to choose a descriptive, memorable name.
            </p>
            <input
              type="text"
              name="vaultName"
              placeholder="Earner Vault Name"
              className="mt-4"
              value={formData.vaultName}
              onChange={handleInputChange}
            />
          </div>

          <div className="text-center mt-12">
            <h1 className="text-3xl font-bold mb-4">Lets setup the Permission for your Members</h1>
            <p className="text-gray-500">Add Solana wallet addresses, separated by a comma or line-break.</p>
            <input
              type="text"
              name="walletAddresses"
              placeholder="9WzDXwBjf8iwHjdi..."
              className="mt-4"
              value={formData.walletAddresses}
              onChange={handleInputChange}
            />
          </div>

          <div className="text-center mt-12">
            <h1 className="text-3xl font-bold mb-4">Next, set your Vault approval threshold.</h1>
            <p className="text-gray-500">Adjust the percentage to determine votes needed to pass a proposal.</p>
            <input
              type="number"
              name="approvalThreshold"
              placeholder="60"
              className="mt-4"
              value={formData.approvalThreshold}
              onChange={handleInputChange}
            />
          </div>

          <div className="text-center mt-12">
            <button type="submit" className="px-8 py-2 bg-green-500 text-white" >
              Create EarnerVault
            </button>
          </div>

        </form>
    </>
  );
}
