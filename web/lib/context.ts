"use client";
import { createContext } from "react";


interface User {
    uid: string;
    photoURL: string;
    username: string;
    displayName: string;
}
interface UserContext {
    user: User | null;
    username: string | null;
}

export const UserContext = createContext<UserContext>({ user: null, username: null });
