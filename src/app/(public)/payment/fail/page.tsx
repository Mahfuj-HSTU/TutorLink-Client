"use client";

import Link from "next/link";
import { XCircle, ArrowRight, RefreshCw } from "lucide-react";

export default function PaymentFailPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 shadow-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <XCircle size={36} className="text-red-500" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-900">Payment Failed</h1>
        <p className="mb-6 text-sm text-slate-500">
          Your payment could not be processed or was cancelled. You can try again from your bookings page.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/bookings"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            <RefreshCw size={14} />
            Try Again
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Go to Dashboard
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
