"use client";

import { useGetTutorBookingsQuery } from "@/lib/redux/api/bookingApi";
import { useUpdateBookingStatusMutation } from "@/lib/redux/api/bookingApi";
import BookingCard from "@/components/features/bookings/BookingCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { BookingStatus } from "@/types";
import toast from "react-hot-toast";
import { CalendarDays } from "lucide-react";

export default function TutorBookingsPage() {
  const { data, isLoading } = useGetTutorBookingsQuery();
  const bookings = data?.data ?? [];

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateBookingStatusMutation();

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
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        Student Bookings
      </h1>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <CalendarDays size={48} className="mb-3 opacity-30" />
          <p>No bookings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              viewAs="tutor"
              onStatusChange={handleStatusChange}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
