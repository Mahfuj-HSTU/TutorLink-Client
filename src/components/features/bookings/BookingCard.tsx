"use client";

import type { Booking, BookingStatus } from "@/types";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { formatDateTime } from "@/lib/utils";
import { useInitPaymentMutation } from "@/lib/redux/api/paymentApi";
import { CalendarDays, Clock, CreditCard, MessageSquare, Pencil, Timer } from "lucide-react";
import toast from "react-hot-toast";

const statusConfig: Record<BookingStatus, { border: string; badge: string; label: string }> = {
  CONFIRMED: {
    border: "border-l-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    label: "Confirmed",
  },
  COMPLETED: {
    border: "border-l-green-500",
    badge: "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200",
    label: "Completed",
  },
  CANCELLED: {
    border: "border-l-slate-300",
    badge: "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200",
    label: "Cancelled",
  },
};

const avatarColor: Record<BookingStatus, string> = {
  CONFIRMED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-slate-100 text-slate-500",
};

function getInitials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function getDuration(start: string, end: string): string {
  const diffMs = new Date(end).getTime() - new Date(start).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

interface BookingCardProps {
  booking: Booking;
  viewAs: "student" | "tutor";
  onStatusChange?: (id: string, status: BookingStatus) => void;
  isUpdating?: boolean;
  onReview?: (booking: Booking) => void;
}

export default function BookingCard({
  booking,
  viewAs,
  onStatusChange,
  isUpdating,
  onReview,
}: BookingCardProps) {
  const [initPayment, { isLoading: isPaymentLoading }] = useInitPaymentMutation()
  const counterpart = viewAs === "student" ? booking.tutor?.user : booking.student;
  const hasReview = !!booking.review;
  const showReviewSection = viewAs === "student" && booking.status === "COMPLETED" && !!onReview;
  const sessionEnded = new Date() >= new Date(booking.endTime);
  const isPaid = booking.payment?.status === "PAID";

  const handlePayNow = async () => {
    try {
      const res = await initPayment({ bookingId: booking.id }).unwrap()
      window.location.href = res.data.gatewayUrl
    } catch {
      toast.error("Could not initiate payment. Please try again.")
    }
  }
  const { border, badge, label } = statusConfig[booking.status];
  const duration = getDuration(booking.startTime, booking.endTime);

  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 border-l-4 ${border} bg-white shadow-sm`}>
      {/* Header */}
      <div className="flex items-start gap-3 px-5 pt-5 pb-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColor[booking.status]}`}
        >
          {getInitials(counterpart?.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">
            {counterpart?.name ?? "—"}
          </p>
          <span className={`mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>
            {label}
          </span>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-slate-400">Session fee</p>
          <p className="text-base font-bold text-indigo-700">৳{booking.price.toFixed(0)}</p>
        </div>
      </div>

      <div className="mx-5 border-t border-slate-100" />

      {/* Time + Duration */}
      <div className="flex flex-col gap-1.5 px-5 py-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays size={12} />
            {formatDateTime(booking.startTime)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
            <Timer size={11} />
            {duration}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={12} />
          Ends {formatDateTime(booking.endTime)}
        </span>
      </div>

      {/* Questions */}
      {booking.questions && (
        <div className="mx-5 mb-3 flex gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
          <MessageSquare size={13} className="mt-0.5 shrink-0 text-indigo-400" />
          <p className="text-xs leading-relaxed text-slate-600">{booking.questions}</p>
        </div>
      )}

      {/* Payment status chip */}
      {booking.status === "CONFIRMED" && sessionEnded && (
        <div className={`mx-5 mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
          isPaid
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
            : "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200"
        }`}>
          <CreditCard size={12} />
          {isPaid ? "Payment received" : "Awaiting payment from student"}
        </div>
      )}

      {/* Student review (inline) */}
      {showReviewSection && hasReview && (
        <div className="mx-5 mb-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col gap-1">
              <p className="mb-1 text-xs font-medium text-amber-700">Your Review</p>
              <StarRating value={booking.review!.rating} size={13} />
              {booking.review!.comment && (
                <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                  {booking.review!.comment}
                </p>
              )}
            </div>
            <button
              onClick={() => onReview!(booking)}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-amber-100 hover:text-indigo-600"
              title="Edit review"
            >
              <Pencil size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Tutor read-only review */}
      {viewAs === "tutor" && hasReview && (
        <div className="mx-5 mb-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
          <p className="mb-1.5 text-xs font-medium text-indigo-700">Student Review</p>
          <StarRating value={booking.review!.rating} size={13} />
          {booking.review!.comment && (
            <p className="mt-1 line-clamp-3 text-xs text-slate-600">
              {booking.review!.comment}
            </p>
          )}
        </div>
      )}

      {/* Student: Pay Now — shown after session ends, before payment */}
      {viewAs === "student" && booking.status === "CONFIRMED" && sessionEnded && !isPaid && (
        <div className="border-t border-slate-100 px-5 py-3">
          <Button
            size="sm"
            className="w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-500"
            onClick={handlePayNow}
            loading={isPaymentLoading}
          >
            <CreditCard size={14} />
            Pay ৳{booking.price.toFixed(0)} Now
          </Button>
          <p className="mt-1.5 text-center text-xs text-slate-400">
            Secure payment via SSLCommerz
          </p>
        </div>
      )}

      {/* Tutor actions */}
      {viewAs === "tutor" && booking.status === "CONFIRMED" && onStatusChange && (
        <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onStatusChange(booking.id, "COMPLETED")}
              loading={isUpdating}
              disabled={!sessionEnded}
              className="flex-1"
            >
              Mark Complete
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onStatusChange(booking.id, "CANCELLED")}
              loading={isUpdating}
            >
              Cancel
            </Button>
          </div>
          {!sessionEnded && (
            <p className="text-center text-xs text-slate-400">
              Available after session ends · {new Date(booking.endTime).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* Student cancel */}
      {viewAs === "student" && booking.status === "CONFIRMED" && onStatusChange && (
        <div className="border-t border-slate-100 px-5 py-3">
          <Button
            size="sm"
            variant="danger"
            onClick={() => onStatusChange(booking.id, "CANCELLED")}
            loading={isUpdating}
          >
            Cancel Session
          </Button>
        </div>
      )}

      {/* Student leave review */}
      {showReviewSection && !hasReview && (
        <div className="border-t border-slate-100 px-5 py-3">
          <Button size="sm" variant="outline" onClick={() => onReview!(booking)}>
            Leave a Review
          </Button>
        </div>
      )}
    </div>
  );
}
