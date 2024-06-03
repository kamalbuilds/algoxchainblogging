"use client";
import { useState } from "react";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";
import { auth, firestore, serverTimestamp } from "../../../lib/firebase";
import { AuthCheck, ImageUploader } from "../../../components";
import axios from "axios";
import styles from "../../Admin.module.css";
import { useParams } from "next/navigation";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { signAndSendTransaction, Network, ShyftWallet } from '@shyft-to/js';

type PostType = {
  title: string;
  slug: string;
  username: string;
  description?: string;
};

interface FormInputs {
  content: string;
  description: string;
  published: boolean;
  imageUrl?: string;
}

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const router = useParams();
  console.log(router, "r");
  const { slug } = router;

  const { connection } = useConnection();
  const wallet = useWallet();
  const [tags, setTags] = useState<string[]>([]);

  console.log(wallet.publicKey?.toBase58(), "wallet");
  const publickey = wallet.publicKey?.toBase58();

  console.log(slug, "slug")

  const postRef = auth?.currentUser && firestore
    .collection("users")
    .doc(auth?.currentUser.uid)
    .collection("posts")
    .doc(slug as string);
  const [post] = useDocumentData<PostType>(postRef);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (e : any) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success("Image selected");
    }
  };


  async function mintCollectionNFT(selectedFile?: File) {
    // Create FormData object and append your fields
    const formData = new FormData();

    const descr = post?.description;
    if (selectedFile) {
      formData.append("image", selectedFile, selectedFile.name);
    }
    formData.append("network", 'devnet');
    formData.append("creator_wallet", publickey!);
    formData.append("name", slug);
    formData.append("symbol", "SOLQUILL");
    formData.append("description", descr!);
    formData.append("attributes", JSON.stringify(tags.map((tag, index) => ({
      "trait_type": `Tag ${index + 1}`,
      "value": tag
    }))));
    formData.append("external_url", `https://solquill.vercel.app/${post?.username}/${post?.slug}`);
    formData.append("fee_payer", publickey!);
    formData.append("max_supply", '0');
    formData.append("service_charge", JSON.stringify({
      "receiver": "6cVCyRQhd2oZoVukbmngTuXSBtoogHR4NLsgQhydMU1R",
      // "token": "DjMA5cCK95X333t7SgkpsG5vC9wMk7u9JV4w8qipvFE8", // USDC or any other token
      "amount": 0.01
    }));
    
    axios.post ('https://api.shyft.to/sol/v2/nft/create', formData, {
      headers: {
        "x-api-key": `${process.env.NEXT_PUBLIC_SHYFT_API}`,
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(response => {
        console.log(response.data);
        const encodedTransaction =response.data.result.encoded_transaction;
        toast.success("Transaction generated successfully");
        async function signTransaction(network: string, encodedTransaction: string) {
          try {

            console.log(network,encodedTransaction,"network,encodedTransaction befr");

            const signandconfirm = await signAndSendTransaction(connection, encodedTransaction, wallet);
            toast.success("NFT minted successfully");
            console.log(signandconfirm,"signandconfirm");

            // const ares = await axios.post('/api/sign', {
            //   network,
            //   encodedTransaction,
            // }, {
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            // });
            //     console.log(ares,"acxresd");
            // const response = await fetch('/api/sign', {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({
            //     network,
            //     encodedTransaction,
            //   }),
            // });

            // console.log(response,"response from backend");
        
            // if (!response.ok) {
            //   throw new Error(`HTTP error! Status: ${response.status}`);
            // }
        
            // const data = await response.json();
            // console.log('Signed transaction:', data);
            return signandconfirm; // Contains the signature
          } catch (error) {
            console.error('Error signing transaction:', error);
          }
        }

       
        (async () => {
          try {
            const sign = await signTransaction('devnet', encodedTransaction);
            console.log(sign,"sign");
            // const txnSignature = await signAndSendTransaction(
            //   connection,
            //   encodedTransaction,
            //   wallet
            // );
            // console.log(txnSignature);
          } catch (error) {
            console.log(error);
          }
        })();
      })
  }

  const createTransactionCallback = async () => {
    try {
        const response = await fetch(
            "https://api.shyft.to/sol/v1/callback/create",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': `${process.env.NEXT_PUBLIC_SHYFT_API}`
                },
                body: JSON.stringify({
                    "network": "devnet", //or devnet
                    "events": ["TOKEN_TRANSFER"],
                    "addresses": [
                      "6cVCyRQhd2oZoVukbmngTuXSBtoogHR4NLsgQhydMU1R",
                    ],
                    "callback_url": "https://solquill.vercel.app/api/hello",
                    "type": "CALLBACK", //optional, default is CALLBACK
                    "enable_raw": true, //optional, to receive jsonParsed Solana tx
                    "enable_events": true //optional, to receive anchor events emitted in the tx
                }),
            }
        );
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.error("callback creation error", e);
    }
}


  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>
            
            <PostForm postRef={postRef} defaultValues={post} preview={preview} tags={tags} setTags={setTags} />
          </section>
          <aside>
            <div className="card">
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)} className="text-black text-xl bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900">
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-xl px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Live view</button>
            </Link>
            <label className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded hover:cursor-pointer">
              📸 Upload NFT Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            </label>
            {/* @ts-ignore */}
            <button onClick={()=> mintCollectionNFT(selectedFile)} className="btn-blue">Mint Article as NFT</button>
            <button onClick={createTransactionCallback} className="btn-blue">Monitor Vault</button>
            <Link href="/earnervault">
              <button className="btn-blue">Create EarnerVault</button>
            </Link>
            </div>
          </aside>
        </>
      )}
    </main>
  );
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function PostForm({ defaultValues, postRef, preview, tags, setTags }) {
  const { register, handleSubmit, reset, watch, formState, errors  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;
  const wallet = useWallet();
  const publicaddr = wallet.publicKey?.toBase58();
  const [imageUrl, setImageUrl] = useState(defaultValues.imageUrl || '');
  const [earnervault, setEarnervault] = useState("");
  const updatePost = async ({ content, published , description}: FormInputs) => {
    await postRef.update({
      content,
      description,
      published,
      imageUrl,
      updatedAt: serverTimestamp(),
      publicaddr,
      tags
    });
    reset({ content, published , description, tags});
    
    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />
        <input
          name="img"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <label className="label">
          <span className="label-text text-xl">Description</span>
        </label>
        <textarea
          name="description"
          ref={register({
            maxLength: { value: 20000, message: "description is too long" },
            minLength: { value: 10, message: "description is too short" },
            required: { value: true, message: "description is required" },
          })}
          placeholder="Description..."
        ></textarea>
        <div>
          <input
            name="tagInput"
            type="text"
            className="my-6"
            placeholder="Enter a tag and press enter"
            onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
              e.preventDefault(); // Prevent form submission
              const newTag = e.currentTarget.value.trim();
              if (!tags.includes(newTag) && tags.length < 4) { // Limit to 4 tags, adjust as needed
                setTags([...tags, newTag]);
              }
              e.currentTarget.value = ''; // Clear input
            }
          }}
          />
          <div>Tags: {tags.join(', ')}</div>
          <button onClick={() => setTags([])}>Clear tags</button>
        </div>
        <input
            name="earnervault"
            type="text"
            className="my-6"
            placeholder="Enter the earnervault address"
            onChange={(e) => setEarnervault(e.target.value)}
          />
        <label className="label">
          <span className="label-text text-xl">Content</span>
        </label>
        <textarea
          name="content"
          ref={register({
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
          placeholder="Write your post content here..."
        ></textarea>

        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}
        <fieldset>
          <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            ref={register}
          />
          <label>Published</label>
        </fieldset>
        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
