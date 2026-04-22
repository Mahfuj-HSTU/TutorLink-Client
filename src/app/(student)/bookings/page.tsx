'use client'

import { useState } from 'react'
import {
  useGetMyBookingsQuery,
  useUpdateBookingStatusMutation
} from '@/lib/redux/api/bookingApi'
import {
  useCreateReviewMutation,
  useUpdateReviewMutation
} from '@/lib/redux/api/reviewApi'
import BookingCard from '@/components/features/bookings/BookingCard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import StarRating from '@/components/ui/StarRating'
import type { Booking, BookingStatus } from '@/types'
import toast from 'react-hot-toast'
import { CalendarDays } from 'lucide-react'

type Filter = 'ALL' | BookingStatus

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' }
]

export default function StudentBookingsPage() {
  const { data, isLoading } = useGetMyBookingsQuery()
  const bookings = data?.data ?? []
  const [filter, setFilter] = useState<Filter>('ALL')
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [createReview, { isLoading: isCreatingReview }] = useCreateReviewMutation()
  const [updateReview, { isLoading: isUpdatingReview }] = useUpdateReviewMutation()
  const [updateStatus, { isLoading: isCancelling }] = useUpdateBookingStatusMutation()
  const isReviewing = isCreatingReview || isUpdatingReview

  const counts: Record<Filter, number> = {
    ALL: bookings.length,
    CONFIRMED: bookings.filter((b) => b.status === 'CONFIRMED').length,
    COMPLETED: bookings.filter((b) => b.status === 'COMPLETED').length,
    CANCELLED: bookings.filter((b) => b.status === 'CANCELLED').length
  }

  const filtered = filter === 'ALL' ? bookings : bookings.filter((b) => b.status === filter)

  const handleOpenReview = (booking: Booking) => {
    setReviewTarget(booking)
    setRating(booking.review?.rating ?? 5)
    setComment(booking.review?.comment ?? '')
  }

  const handleReviewSubmit = async () => {
    if (!reviewTarget) return
    try {
      if (reviewTarget.review) {
        await updateReview({
          id: reviewTarget.review.id,
          rating,
          comment: comment.trim() || undefined
        }).unwrap()
        toast.success('Review updated!')
      } else {
        await createReview({
          rating,
          comment: comment.trim() || undefined,
          tutorId: reviewTarget.tutorId,
          bookingId: reviewTarget.id
        }).unwrap()
        toast.success('Review submitted!')
      }
      setReviewTarget(null)
      setRating(5)
      setComment('')
    } catch {
      toast.error('Could not save review. Please try again.')
    }
  }

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await updateStatus({ id, status }).unwrap()
      toast.success('Session cancelled.')
    } catch {
      toast.error('Could not cancel booking. Please try again.')
    }
  }

  if (isLoading) return <LoadingSpinner fullPage />

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-slate-900'>My Bookings</h1>
        {bookings.length > 0 && (
          <span className='text-sm text-slate-400'>{bookings.length} total</span>
        )}
      </div>

      {bookings.length > 0 && (
        <div className='mb-6 flex gap-1 rounded-xl bg-slate-100 p-1'>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              {f.label}
              {counts[f.value] > 0 && (
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    filter === f.value
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                  {counts[f.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className='flex flex-col items-center py-20 text-slate-400'>
          <CalendarDays size={48} className='mb-3 opacity-30' />
          <p>{bookings.length === 0 ? 'You have no bookings yet.' : 'No bookings in this category.'}</p>
        </div>
      ) : (
        <div className='columns-1 gap-4 sm:columns-2'>
          {filtered.map((booking) => (
            <div key={booking.id} className='mb-4 break-inside-avoid'>
              <BookingCard
                booking={booking}
                viewAs='student'
                onStatusChange={handleStatusChange}
                isUpdating={isCancelling}
                onReview={handleOpenReview}
              />
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!reviewTarget}
        onClose={() => setReviewTarget(null)}
        title={reviewTarget?.review ? 'Edit Your Review' : 'Leave a Review'}>
        <div className='flex flex-col gap-4'>
          <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Your Rating
            </label>
            <StarRating value={rating} interactive onChange={setRating} size={28} />
          </div>
          <div>
            <label className='mb-1 block text-sm font-medium text-slate-700'>
              Comment (optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Share your experience...'
              className='w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
            />
          </div>
          <div className='flex justify-end gap-3'>
            <Button variant='secondary' onClick={() => setReviewTarget(null)}>
              Cancel
            </Button>
            <Button onClick={handleReviewSubmit} loading={isReviewing}>
              {reviewTarget?.review ? 'Update Review' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
