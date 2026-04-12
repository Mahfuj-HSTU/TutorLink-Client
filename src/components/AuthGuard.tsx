"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/use-auth";
import type { UserRole } from "@/types";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      // Redirect to their own dashboard instead of a blank page
      if (user.role === "ADMIN") router.replace("/admin/dashboard");
      else if (user.role === "TUTOR") router.replace("/tutor/dashboard");
      else router.replace("/dashboard");
    }
  }, [user, isPending, router, allowedRoles]);

  // Show spinner while: session is loading, redirect to /login is in flight,
  // or role-mismatch redirect is in flight — prevents a blank page flash.
  if (isPending || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
