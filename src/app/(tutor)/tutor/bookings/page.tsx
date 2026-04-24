"use client";

import { useState } from "react";
import { useGetTutorBookingsQuery, useUpdateBookingStatusMutation } from "@/lib/redux/api/bookingApi";
import BookingCard from "@/components/features/bookings/BookingCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { BookingStatus } from "@/types";
import toast from "react-hot-toast";
import { CalendarDays } from "lucide-react";

type Filter = "ALL" | BookingStatus;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All", value: "ALL" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function TutorBookingsPage() {
  const { data, isLoading } = useGetTutorBookingsQuery();
  const bookings = data?.data ?? [];
  const [filter, setFilter] = useState<Filter>("ALL");
  const [updateStatus, { isLoading: isUpdating }] = useUpdateBookingStatusMutation();

  const counts: Record<Filter, number> = {
    ALL: bookings.length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Booking marked as ${status.toLowerCase()}.`);
    } catch {
      toast.error("Could not update booking status.");
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Student Bookings</h1>
        {bookings.length > 0 && (
          <span className="text-sm text-slate-400">{bookings.length} total</span>
        )}
      </div>

      {bookings.length > 0 && (
        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1 scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors sm:flex-1 sm:px-3 sm:text-sm ${
                filter === f.value
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f.label}
              {counts[f.value] > 0 && (
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    filter === f.value
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {counts[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <CalendarDays size={48} className="mb-3 opacity-30" />
          <p>{bookings.length === 0 ? "No bookings yet." : "No bookings in this category."}</p>
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2">
          {filtered.map((booking) => (
            <div key={booking.id} className="mb-4 break-inside-avoid">
              <BookingCard
                key={booking.id}
                booking={booking}
                viewAs="tutor"
                onStatusChange={handleStatusChange}
                isUpdating={isUpdating}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
