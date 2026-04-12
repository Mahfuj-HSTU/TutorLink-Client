"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { useAuth } from "@/lib/use-auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already logged in — send to the right dashboard
  useEffect(() => {
    if (isPending || !user) return;
    if (user.role === "ADMIN") router.replace("/admin/dashboard");
    else if (user.role === "TUTOR") router.replace("/tutor/dashboard");
    else router.replace("/dashboard");
  }, [user, isPending, router]);

  // Only hide the form once we *know* the user is logged in (not while still checking)
  if (!isPending && user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Invalid credentials. Please try again.");
        return;
      }

      toast.success("Welcome back!");

      const role = (result.data as { user?: { role?: string } })?.user?.role;
      if (role === "ADMIN") router.push("/admin/dashboard");
      else if (role === "TUTOR") router.push("/tutor/dashboard");
      else router.push("/dashboard");

      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Welcome back</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="mt-2 w-full" size="lg">
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-indigo-600 hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        <strong>Admin demo:</strong> admin@tutorlink.com / tutorlink_admin123
      </div>
    </>
  );
}
