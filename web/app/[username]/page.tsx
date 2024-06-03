"use client"
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { UserProfile, PostFeed } from "../../components";
import { getUserWithUsername, postToJSON } from "../../lib/firebase";

// Define your types/interfaces
interface User {
  photoURL: string;
  username: string;
  displayName: string;
}

interface IPost {
  // Define properties based on your post's data structure
  title: string;
  createdAt: string;
  // More post properties...
}

function UserProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]); // Assuming posts is an array of IPost objects
  const router = useRouter();
  const [searchParams] = useSearchParams(); // Assuming you use this for something not shown

  console.log(router, "router", searchParams);
  const username = usePathname().split("/").pop();

  console.log(username, "username");
  useEffect(() => {
    const fetchUserData = async () => {
      if (!username) return;
      const userDoc = await getUserWithUsername(username);

      if (userDoc) {
        setUser(userDoc.data() as User); // Cast to IUser if you're confident in the structure, otherwise add checks
        const postsQuery = userDoc.ref
          .collection("posts")
          .where("published", "==", true)
          .orderBy("createdAt", "desc")
          .limit(5);

        const postsData = (await postsQuery.get()).docs.map(postToJSON) as IPost[];
        setPosts(postsData);
      } else {
        console.log("User not found");
      }
    };

    fetchUserData();
  }, [username]); // Dependency array to re-run effect when username changes

  if (!user) {
    return <div>Loading...</div>; // Placeholder for loading state or user not found
  }

  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={true} /> {/* Assuming admin is a boolean prop required by PostFeed */}
    </main>
  );
}

export default UserProfilePage;
