import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import AlgoConnect from "./AlgoConnect";

function Navbar() {
  const { username, user } = useContext(UserContext);

  const router = useRouter();
  const signOut = () => {
    auth.signOut();
    router.refresh();
  };

  return (
    <nav className="flex flex-1 justify-center">
      {username && (
        <div className="flex flex-row gap-4 items-center">
          <li className="justify-center">
            <button className="btn-blue m-0" onClick={signOut}>Sign Out</button>
          </li>
          <li>
            <Link href="/admin" className="p-o">
              <button className="btn-blue m-0">Write Posts</button>
            </Link>
          </li>
          <li>
            <Link href={`/${username}`} className="p-o">
              <button className="btn-blue m-0">Profile pg</button>
            </Link>
          </li>
        </div>
      )}
      {!username && (
        <li>
          <Link href="/login" className="p-o">
            <button className="btn-blue m-0">Login</button>
          </Link>
        </li>
      )}
      <AlgoConnect />
    </nav>
  );
}

export default Navbar;
