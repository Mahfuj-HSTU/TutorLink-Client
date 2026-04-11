import Link from "next/link";
import { BookOpen } from "lucide-react";

// Minimal layout for login / register pages — centred card with logo.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-indigo-600"
          >
            <BookOpen size={28} />
            <span className="text-2xl">TutorLink</span>
          </Link>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
}
