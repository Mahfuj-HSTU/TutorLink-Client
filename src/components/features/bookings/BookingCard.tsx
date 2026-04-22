"use client";

import type { Booking, BookingStatus } from "@/types";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { formatDateTime } from "@/lib/utils";
import { CalendarDays, Clock, MessageSquare, Pencil } from "lucide-react";

const statusVariant: Record<BookingStatus, "success" | "warning" | "danger"> = {
  CONFIRMED: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

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
  const counterpart =
    viewAs === "student" ? booking.tutor?.user : booking.student;

  const hasReview = !!booking.review;
  const showReviewSection =
    viewAs === "student" && booking.status === "COMPLETED" && !!onReview;
  const sessionEnded = new Date() >= new Date(booking.endTime);

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-slate-900">
              {counterpart?.name ?? "—"}
            </p>
            <Badge variant={statusVariant[booking.status]} className="mt-1">
              {booking.status}
            </Badge>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-indigo-700">
              ৳{booking.price.toFixed(0)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <CalendarDays size={14} />
            {formatDateTime(booking.startTime)}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={14} />
            Ends: {formatDateTime(booking.endTime)}
          </span>
        </div>

        {/* Questions */}
        {booking.questions && (
          <div className="flex gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <MessageSquare size={14} className="mt-0.5 shrink-0 text-indigo-400" />
            <p className="text-xs text-slate-600 leading-relaxed">{booking.questions}</p>
          </div>
        )}

        {/* Inline review display — student view */}
        {showReviewSection && hasReview && (
          <div className="mt-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-1">
                <StarRating value={booking.review!.rating} size={14} />
                {booking.review!.comment && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                    {booking.review!.comment}
                  </p>
                )}
              </div>
              <button
                onClick={() => onReview(booking)}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-amber-100 hover:text-indigo-600"
                title="Edit review"
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>
        )}
        {/* Inline review display — tutor view (read-only) */}
        {viewAs === "tutor" && hasReview && (
          <div className="mt-1 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
            <p className="mb-1.5 text-xs font-medium text-indigo-700">Student Review</p>
            <StarRating value={booking.review!.rating} size={14} />
            {booking.review!.comment && (
              <p className="mt-1 text-xs text-slate-600 line-clamp-3">{booking.review!.comment}</p>
            )}
          </div>
        )}
      </CardBody>

      {/* Tutor actions */}
      {viewAs === "tutor" && booking.status === "CONFIRMED" && onStatusChange && (
        <CardFooter className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
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
            <p className="text-xs text-slate-400 text-center">
              Available after session ends · {new Date(booking.endTime).toLocaleString()}
            </p>
          )}
        </CardFooter>
      )}

      {/* Student: cancel confirmed session */}
      {viewAs === "student" && booking.status === "CONFIRMED" && onStatusChange && (
        <CardFooter>
          <Button
            size="sm"
            variant="danger"
            onClick={() => onStatusChange(booking.id, "CANCELLED")}
            loading={isUpdating}
          >
            Cancel Session
          </Button>
        </CardFooter>
      )}

      {/* Student: leave review — only shown when no review exists yet */}
      {showReviewSection && !hasReview && (
        <CardFooter>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReview(booking)}
          >
            Leave a Review
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
