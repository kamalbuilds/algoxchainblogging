"use client";
import { useEffect, useState } from "react";
import { PostFeed, Loader } from "../components";
import { firestore, postToJSON, fromMillis } from "../lib/firebase";

const LIMIT = 3;

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const postsQuery = firestore
        .collectionGroup("posts")
        .where("published", "==", true)
        .orderBy("createdAt", "desc")
        .limit(3);

      const newPosts = (await postsQuery.get()).docs.map(postToJSON);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setPosts(newPosts);
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  const getMorePosts = async () => {
    setIsLoading(true);
    const last = posts[posts.length - 1];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const cursor = typeof last.createdAt === "number" ? fromMillis(last.createdAt) : last.createdAt;

    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setPosts(posts.concat(newPosts));
    setIsLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} admin={false} />
      {!isLoading && !postsEnd && (
        <button onClick={getMorePosts} className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">Load More</button>
      )}
      <Loader show={isLoading} />
      {postsEnd && "You have reached the end!"}
    </main>
  );
}
