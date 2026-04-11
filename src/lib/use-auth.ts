"use client";

import { useSession } from "@/lib/auth-client";
import type { User } from "@/types";

// Typed wrapper around better-auth's useSession.
// better-auth only knows about base fields; we cast the user to our
// full User type that includes the custom `role`, `phone`, and `isBanned` fields.
export function useAuth() {
  const { data: session, isPending } = useSession();
  const user = session?.user as User | undefined;
  return { user, isPending, session };
}
