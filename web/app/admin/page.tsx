"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCheck, PostFeed } from "../../components";
import { UserContext } from "../../lib/context";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

import styles from "../Admin.module.css";

function PostList() {
  const ref = auth.currentUser && firestore.collection("users").doc(auth.currentUser.uid).collection("posts");
  const query = ref && ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);
// @ts-ignore
  const posts = querySnapshot?.docs.map((doc : { data: any }) => ({ id: doc?.id, ...doc.data() }));
  // State to manage active tab
  const [activeTab, setActiveTab] = useState("published");

  // Filter posts based on the active tab
  const filteredPosts = posts?.filter((post : any) => (activeTab === "published" ? post.published : !post.published));

  return (
    <>
      <h1>Manage your Posts</h1>
      <div className="tabs flex">
      <button onClick={() => setActiveTab("published")} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Published
        </button>
        <button onClick={() => setActiveTab("drafts")} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
          Drafts
        </button>
      </div>
      <PostFeed posts={filteredPosts} admin />
    </>
  );
}


function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth?.currentUser && auth.currentUser.uid;
    const ref = uid && firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
      imageUrl: "",
    };

    if (ref) {
      await ref.set(data);
      toast.success("Post Created!");
      router.push(`/admin/${slug}`);
    }

  };

  return (
    <form onSubmit={createPost} className="my-8">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}

function AdminPostsPage() {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

export default AdminPostsPage;
