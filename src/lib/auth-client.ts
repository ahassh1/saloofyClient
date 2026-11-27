import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

// Type-only import: keeps the server auth instance (and the MongoDB client)
// out of the browser bundle.
import type { auth } from "./auth";

// One configured client for the whole app. Every helper below is exported from
// this instance so `baseURL` and the additional-field types are never lost.
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
