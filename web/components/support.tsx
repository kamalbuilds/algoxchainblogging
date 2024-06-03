import { MetaMaskSDK, SDKProvider } from "@metamask/sdk";
import {
  Chain,
  Network,
  SignAndSendSigner,
  Signer,
  TokenTransfer,
  TokenTransferDetails,
  Wormhole,
  WormholeMessageId,
  amount,
  chainToPlatform,
  encoding,
  isNative,
  toChainId,
  wormhole,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";

import { useEffect, useState } from "react";

import "../app/support.module.css";
import { MetaMaskSigner } from "../lib/metamask";
import { PhantomProvider, PhantomSigner } from "../lib/phantom";
import toast from "react-hot-toast";

const msk = new MetaMaskSDK(
  {
    dappMetadata: {
        name: "SolQuill🪶",
        url: "https://solquill.vercel.app",
    },
  }
);
function Support(addr : any) {
  
    const NETWORK = "Testnet";
  const [evmProvider, setEvmProvider] = useState<SDKProvider | null>(null);
  const [evmSigner, setEvmSigner] = useState<SignAndSendSigner<
    Network,
    Chain
  > | null>(null);

  const [phantomProvider, setPhantomProvider] =
    useState<PhantomProvider | null>(null);
  const [solSigner, setSolSigner] = useState<SignAndSendSigner<
    Network,
    Chain
  > | null>(null);

  const [srcChain,setSrcChain] = useState<Chain>("Avalanche");
  const [dstChain] = useState<Chain>("Solana");

  function getSigner(chain: Chain): Signer {
    const isEvm = chainToPlatform(chain) === "Evm"
    const s =  isEvm? evmSigner : solSigner;
    if(!s) throw new Error("No signer for: "+ chain)
    if(isEvm){
      (s as MetaMaskSigner).requestChainChange(chain)
    }
    return s
  }

  function getAddresses()  {
    try {
    const srcAddress = getSigner(srcChain).address();
    const dstAddress = getSigner(dstChain).address();
    return { [srcChain]: srcAddress, [dstChain]: dstAddress };
    }catch {}
    return { [srcChain]: "Not connected", [dstChain]: "Not connected" };
  }

  // Set once the transfer is started
  const [transfer, setTransfer] = useState<TokenTransfer | null>(null);
  const [transferDetails, setTransferDetails] =
    useState<TokenTransferDetails | null>(null);
  const [srcTxIds, setSrcTxIds] = useState<string[]>([]);
  // Set once the transfer is attested
  const [attestations, setAttestations] = useState<WormholeMessageId[]>([]);
  // Set after completing transfer
  const [dstTxIds, setDstTxIds] = useState<string[]>([]);

  const [wh, setWormhole] = useState<Wormhole<Network> | null>(null);

  const handleSrcChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSrcChain(e.target.value as Chain);
  };

  useEffect(() => {
    if (!wh) wormhole(NETWORK, [evm, solana]).then(setWormhole);
  });

  // Effect for phantom/solana
  useEffect(() => {
    if (phantomProvider || !("phantom" in window) || !wh) return;
    (async function () {
      // @ts-ignore
      const provider = window.phantom!.solana as PhantomProvider;
      if (!provider?.isPhantom) return;

      await provider.connect();
      await PhantomSigner.fromProvider(wh!, provider).then((signer) => {
        setSolSigner(signer);
      });
      setPhantomProvider(provider);
    })().catch((e) => {
      console.error(e);
    });
  }, [phantomProvider, wh]);

  // Effect for metamask/evm
  useEffect(() => {
    if (evmProvider) return;
    (async function () {
      await msk.connect();
      const provider = msk.getProvider();
      await MetaMaskSigner.fromProvider(provider!).then((signer) => {
        setEvmSigner(signer);
      });
      setEvmProvider(provider!);
    })().catch((e) => {
      console.error(e);
    });
  }, [evmProvider, wh]);

  async function start(): Promise<void> {
    if (!wh) throw new Error("No wormhole");

    const signer = getSigner(srcChain)
    if (!signer) throw new Error("No signer");


    // Create a transfer
    const chainCtx = wh.getChain(signer.chain());
    const amt = amount.units(
      amount.parse("0.01", chainCtx.config.nativeTokenDecimals)
    );
    const snd = Wormhole.chainAddress(signer.chain(), signer.address());
    const tkn = Wormhole.tokenId(chainCtx.chain, "native");

    const dstSigner = getSigner(dstChain)
    const rcv = Wormhole.chainAddress(dstSigner.chain(), addr.dstnaddr);

    console.log(tkn,amt,snd,rcv,"teas")
    const xfer = await wh.tokenTransfer(tkn, amt, snd, rcv, false);

    // Update state
    setTransfer(xfer);
    setTransferDetails(xfer.transfer);

    // Start the transfer
    const txids = await xfer.initiateTransfer(signer);
    setSrcTxIds(txids);

    // Wait for attestation to be available
    const att = await xfer.fetchAttestation(60_000);
    setAttestations(att as WormholeMessageId[]);
    toast.success("Attestation ready 🚀");
  }

  async function finish(): Promise<void> {
    if (!wh) throw new Error("No wormhole");
    if (!transfer) throw new Error("No Current transfer");

    const signer = dstChain === "Solana" ? solSigner : evmSigner;
    if (!signer) throw new Error("No signer");

    // Finish transfer with updated signer
    const finalTxs = await transfer.completeTransfer(signer);
    setDstTxIds(finalTxs);
  }
  return (
    <>
  <div className="card p-4">
        <label htmlFor="sourceChain" className="block mb-2 text-sm font-medium text-gray-900">Select Source Chain:</label>
        <select
          name="sourceChain"
          id="sourceChain"
          value={srcChain}
          onChange={handleSrcChainChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="Arbitrum">Arbitrum</option>
          <option value="Aurora">Aurora</option>
          <option value="Avalanche">Avalanche</option>
          <option value="Base">Base</option>
          <option value="Bsc">Bsc</option>
          {/* Add other options here... */}
          <option value="Scroll">Scroll</option>
        </select>
        <p>
          {srcChain}: {getAddresses()[srcChain]}{" "}
        </p>
        <p>
          {dstChain}: {getAddresses()[dstChain]}{" "}
        </p>
      </div>

      <div className="card">
        <button onClick={start} disabled={srcTxIds.length > 0}>
          Start transfer
        </button>
      </div>

      <TransferDetailsCard
        details={transferDetails}
        attestations={attestations}
        srcTxIds={srcTxIds}
        dstTxIds={dstTxIds}
      />
      <div className="card">
        <button onClick={finish} disabled={attestations.length == 0}>
          Complete transfer
        </button>
      </div>
    </>
  );
}

type TransferProps = {
  details: TokenTransferDetails | null;
  attestations: WormholeMessageId[];
  srcTxIds: string[];
  dstTxIds: string[];
};

function TransferDetailsCard(props: TransferProps) {
  if (!props.details)
    return (
      <div className="card">
        <p>
          Click <b>Start Transfer</b> to initiate the transfer
        </p>
      </div>
    );

  const { details, srcTxIds, attestations, dstTxIds } = props;
  const token = isNative(details.token.address)
    ? "Native"
    : details.token.address.toString();

  return (
    <div className="card">
      <h3>Transfer</h3>
      <p>
        From: {details.from.chain} : {details.from.address.toString()}
      </p>
      <p>
        To: {details.to.chain} : {details.to.address.toString()}
      </p>
      <p>Token: {token}</p>
      <p>Amount: {details.amount.toString()}</p>
      <hr />
      <h3>Source Transactions</h3>
      <p>
        {srcTxIds.length > 0 ? srcTxIds.map((t) => `${t}`).join(", ") : "None"}
      </p>
      <hr />
      <h3>Attestations</h3>
      <p>
        {attestations.length > 0
          ? attestations
              .map((att) => {
                const whChainId = toChainId(att.chain);
                const emitter = encoding.stripPrefix(
                  "0x",
                  att.emitter.toString()
                );
                return `${whChainId}/${emitter}/${att.sequence}`;
              })
              .join(", ")
          : "None"}
      </p>
      <h3>Destination Transactions</h3>
      <p>
        {dstTxIds.length > 0 ? dstTxIds.map((t) => `${t}`).join(", ") : "None"}
      </p>
      <hr />
    </div>
  );
}

export default Support;