"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { useAuth } from "@/lib/use-auth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import type { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { user, isPending } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Extract<UserRole, "STUDENT" | "TUTOR">>("STUDENT");
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
      const result = await signUp.email({
        name,
        email,
        password,
        role,
      } as Parameters<typeof signUp.email>[0]);

      if (result.error) {
        setError(result.error.message ?? "Registration failed. Please try again.");
        return;
      }

      toast.success("Account created! Welcome to TutorLink.");

      if (role === "TUTOR") router.push("/tutor/dashboard");
      else router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Create your account</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Full Name"
          type="text"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">I am a…</label>
          <div className="grid grid-cols-2 gap-3">
            {(["STUDENT", "TUTOR"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors ${
                  role === r
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {r === "STUDENT" ? "Student" : "Tutor"}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="mt-2 w-full" size="lg">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Log in
        </Link>
      </p>
    </>
  );
}
