"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const bookingId = params.get("bookingId");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-8 shadow-lg text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-slate-900">Payment Successful!</h1>
        <p className="mb-6 text-sm text-slate-500">
          Your payment has been received. The tutor can now mark this session as complete and you&apos;ll be able to leave a review.
        </p>

        {bookingId && (
          <p className="mb-6 rounded-lg bg-slate-50 px-4 py-2 text-xs text-slate-400">
            Booking ID: <span className="font-mono text-slate-600">{bookingId}</span>
          </p>
        )}

        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          View My Bookings
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
