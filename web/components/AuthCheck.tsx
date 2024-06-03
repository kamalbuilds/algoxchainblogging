import Link from "next/link";
import { PropsWithChildren, useContext } from "react";
import { UserContext } from "../lib/context";

type Props = {
  fallback?: React.ReactNode;
};

const AuthCheck = ({ children, fallback }: PropsWithChildren<Props>) => {
  const { username } = useContext(UserContext);

  return (
    <>
      {username
        ? children
        : fallback || <Link href="/login">You must be signed in</Link>}
    </>
  );
};

export default AuthCheck;
