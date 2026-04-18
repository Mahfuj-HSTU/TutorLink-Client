"use client";

import { useState } from "react";
import { useGetMyBookingsQuery, useUpdateBookingStatusMutation } from "@/lib/redux/api/bookingApi";
import { useCreateReviewMutation, useUpdateReviewMutation } from "@/lib/redux/api/reviewApi";
import BookingCard from "@/components/features/bookings/BookingCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import type { Booking, BookingStatus } from "@/types";
import toast from "react-hot-toast";
import { CalendarDays } from "lucide-react";

export default function StudentBookingsPage() {
  const { data, isLoading } = useGetMyBookingsQuery();
  const bookings = data?.data ?? [];

  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdatingReview }] = useUpdateReviewMutation();
  const [updateStatus, { isLoading: isCancelling }] = useUpdateBookingStatusMutation();

  const isReviewing = isCreatingReview || isUpdatingReview;

  const handleOpenReview = (booking: Booking) => {
    setReviewTarget(booking);
    setRating(booking.review?.rating ?? 5);
    setComment(booking.review?.comment ?? "");
  };

  const handleReviewSubmit = async () => {
    if (!reviewTarget) return;
    try {
      if (reviewTarget.review) {
        await updateReview({
          id: reviewTarget.review.id,
          rating,
          comment: comment.trim() || undefined,
        }).unwrap();
        toast.success("Review updated!");
      } else {
        await createReview({
          rating,
          comment: comment.trim() || undefined,
          tutorId: reviewTarget.tutorId,
          bookingId: reviewTarget.id,
        }).unwrap();
        toast.success("Review submitted!");
      }
      setReviewTarget(null);
      setRating(5);
      setComment("");
    } catch {
      toast.error("Could not save review. Please try again.");
    }
  };

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Session cancelled.");
    } catch {
      toast.error("Could not cancel booking. Please try again.");
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-slate-400">
          <CalendarDays size={48} className="mb-3 opacity-30" />
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              viewAs="student"
              onStatusChange={handleStatusChange}
              isUpdating={isCancelling}
              onReview={handleOpenReview}
            />
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        open={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        title={reviewTarget?.review ? "Edit Your Review" : "Leave a Review"}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Your Rating
            </label>
            <StarRating
              value={rating}
              interactive
              onChange={setRating}
              size={28}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Comment (optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setReviewTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleReviewSubmit} loading={isReviewing}>
              {reviewTarget?.review ? "Update Review" : "Submit Review"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
