"use client";

import type { Booking, BookingStatus } from "@/types";
import { Card, CardBody, CardFooter } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import { CalendarDays, Clock } from "lucide-react";

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
    viewAs === "student"
      ? booking.tutor?.user
      : booking.student;

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
      </CardBody>

      {/* Tutor actions */}
      {viewAs === "tutor" && booking.status === "CONFIRMED" && onStatusChange && (
        <CardFooter className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onStatusChange(booking.id, "COMPLETED")}
            loading={isUpdating}
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
        </CardFooter>
      )}

      {/* Student actions */}
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

      {/* Student: leave or edit a review after completion */}
      {viewAs === "student" &&
        booking.status === "COMPLETED" &&
        onReview && (
          <CardFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReview(booking)}
            >
              {booking.review ? "Edit Review" : "Leave a Review"}
            </Button>
          </CardFooter>
        )}
    </Card>
  );
}
