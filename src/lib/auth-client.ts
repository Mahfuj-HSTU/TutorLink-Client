import { createAuthClient } from "better-auth/react";

// Better-Auth client — connects to the backend's auth endpoints.
// All auth calls (sign-in, sign-up, sign-out, get-session) go through
// the backend at NEXT_PUBLIC_API_URL/api/auth/*.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
