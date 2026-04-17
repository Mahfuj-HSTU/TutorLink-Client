"use client";

import { useState } from "react";
import { useCreateBookingMutation } from "@/lib/redux/api/bookingApi";
import { useAuth } from "@/lib/use-auth";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import type { TutorProfile } from "@/types";

interface Props {
  tutor: Pick<TutorProfile, "id" | "hourlyRate" | "isAvailable"> & {
    user: Pick<TutorProfile["user"], "name">;
  };
}

export default function TutorBookingPanel({ tutor }: Props) {
  const { user } = useAuth();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const handleBook = async () => {
    if (!startTime || !endTime) {
      toast.error("Please fill in both start and end times.");
      return;
    }
    try {
      await createBooking({
        tutorId: tutor.id,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        price: tutor.hourlyRate,
      }).unwrap();
      toast.success("Booking confirmed!");
      setBookingOpen(false);
      setStartTime("");
      setEndTime("");
    } catch {
      toast.error("Could not create booking. Please try again.");
    }
  };

  return (
    <>
      {user?.role === "STUDENT" && tutor.isAvailable && (
        <Button onClick={() => setBookingOpen(true)}>Book Session</Button>
      )}
      {!user && (
        <Button onClick={() => (window.location.href = "/login")}>
          Login to Book
        </Button>
      )}

      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={`Book a session with ${tutor.user.name}`}
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            id="start-time"
          />
          <Input
            label="End Time"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            id="end-time"
          />
          <p className="text-sm text-slate-500">
            Rate: <span className="font-semibold">${tutor.hourlyRate} / hr</span>
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBook} loading={isBooking}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
