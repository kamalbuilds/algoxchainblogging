"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { auth, firestore, googleAuthProvider } from "../../lib/firebase";
import { UserContext } from "../../lib/context";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import debounce from "lodash.debounce";
import { FaGoogle } from "react-icons/fa";

interface IUsernameMessage {
  username: string;
  isValid: boolean;
  isLoading: boolean
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="btn-red flex gap-4" onClick={signInWithGoogle}>
      <FaGoogle className="" />
      <span>Sign In with Google</span>
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e?.target?.value.toLowerCase();
    const regEx = /^(?=[a-zA-z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setIsLoading(false);
      setIsValid(false);
    }

    if (regEx.test(val)) {
      setFormValue(val);
      setIsLoading(true);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username: {
      length: number
    }) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("firebase read");
        setIsValid(!exists);
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (user) {
      const userDoc = firestore.doc(`users/${user.uid}`);
      const usernameDoc = firestore.doc(`usernames/${formValue}`);

      const batch = firestore.batch();
      batch.set(userDoc, {
        username: formValue,
        photoURL: user.photoURL,
        displayName: user.displayName,
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    }




  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={handleChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            isLoading={isLoading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
          <h3>Debug</h3>
          <div>
            username: {formValue}
            <br />
            loading: {isLoading.toString()}
            <br />
            valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, isLoading }: IUsernameMessage) {
  if (isLoading) {
    return <p>Loading...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">Username is already taken!</p>;
  } else {
    return <p></p>;
  }
}

const EnterPage: React.FC = () => {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};

export default EnterPage;
