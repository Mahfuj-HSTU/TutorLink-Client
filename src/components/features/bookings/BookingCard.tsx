'use client'

import type { Booking, BookingStatus } from '@/types'
import Button from '@/components/ui/Button'
import StarRating from '@/components/ui/StarRating'
import { formatDateTime } from '@/lib/utils'
import { useInitPaymentMutation } from '@/lib/redux/api/paymentApi'
import {
  CalendarDays,
  Clock,
  CreditCard,
  MessageSquare,
  Pencil,
  Timer,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const statusConfig = {
  CONFIRMED: {
    accent: 'bg-amber-400',
    gradient: 'from-amber-500/8 via-transparent to-transparent',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    avatar: 'bg-gradient-to-br from-amber-400 to-orange-500',
    label: 'Confirmed',
    Icon: AlertCircle
  },
  COMPLETED: {
    accent: 'bg-emerald-500',
    gradient: 'from-emerald-500/8 via-transparent to-transparent',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    avatar: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    label: 'Completed',
    Icon: CheckCircle2
  },
  CANCELLED: {
    accent: 'bg-slate-300',
    gradient: 'from-slate-400/8 via-transparent to-transparent',
    badge: 'bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200',
    avatar: 'bg-gradient-to-br from-slate-300 to-slate-400',
    label: 'Cancelled',
    Icon: XCircle
  }
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

function getDuration(start: string, end: string): string {
  const diffMs = new Date(end).getTime() - new Date(start).getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

interface BookingCardProps {
  booking: Booking
  viewAs: 'student' | 'tutor'
  onStatusChange?: (id: string, status: BookingStatus) => void
  isUpdating?: boolean
  onReview?: (booking: Booking) => void
}

export default function BookingCard({
  booking,
  viewAs,
  onStatusChange,
  isUpdating,
  onReview
}: BookingCardProps) {
  const [initPayment, { isLoading: isPaymentLoading }] =
    useInitPaymentMutation()
  const counterpart =
    viewAs === 'student' ? booking.tutor?.user : booking.student
  const hasReview = !!booking.review
  const showReviewSection =
    viewAs === 'student' && booking.status === 'COMPLETED' && !!onReview
  const sessionEnded = new Date() >= new Date(booking.endTime)
  const isPaid = booking.payment?.status === 'PAID'
  const { accent, badge, avatar, label, Icon } = statusConfig[booking.status]

  const handlePayNow = async () => {
    try {
      const res = await initPayment({ bookingId: booking.id }).unwrap()
      window.location.href = res.data.gatewayUrl
    } catch {
      toast.error('Could not initiate payment. Please try again.')
    }
  }

  const hasActions =
    // student pay
    (viewAs === 'student' &&
      booking.status === 'CONFIRMED' &&
      sessionEnded &&
      !isPaid) ||
    // student cancel
    (viewAs === 'student' &&
      booking.status === 'CONFIRMED' &&
      !sessionEnded &&
      onStatusChange) ||
    // student review
    (showReviewSection && !hasReview) ||
    // tutor actions
    (viewAs === 'tutor' && booking.status === 'CONFIRMED' && onStatusChange)

  return (
    <div className='group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:shadow-md hover:ring-slate-300'>
      <div className={`h-1 ${accent}`} />

      <div className='relative px-4 py-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3 min-w-0'>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-white ${avatar}`}>
              {getInitials(counterpart?.name)}
            </div>

            <div className='min-w-0'>
              <p className='truncate text-sm font-semibold text-slate-900'>
                {counterpart?.name ?? '—'}
              </p>

              <div className='mt-1 flex items-center gap-1.5'>
                <Icon
                  size={12}
                  className='opacity-60'
                />
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${badge}`}>
                  {label}
                </span>
              </div>
            </div>
          </div>

          <div className='text-right shrink-0'>
            <p className='text-[10px] text-slate-400'>Fee</p>
            <p className='text-lg font-bold text-slate-900'>
              ৳{booking.price.toFixed(0)}
            </p>
          </div>
        </div>

        <div className='my-3 h-px bg-slate-100' />

        <div className='flex items-center justify-between gap-3 text-xs'>
          <div className='flex flex-col gap-1 min-w-0'>
            <span className='flex items-center gap-1.5 text-slate-600'>
              <CalendarDays size={12} />
              {formatDateTime(booking.startTime)}
            </span>
            <span className='flex items-center gap-1.5 text-slate-400'>
              <Clock size={12} />
              Ends {formatDateTime(booking.endTime)}
            </span>
          </div>

          <span className='flex items-center gap-1 rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white'>
            <Timer size={11} />
            {getDuration(booking.startTime, booking.endTime)}
          </span>
        </div>

        {booking.questions && (
          <div className='mt-3 flex gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600'>
            <MessageSquare
              size={13}
              className='text-indigo-400'
            />
            <p className='line-clamp-2'>{booking.questions}</p>
          </div>
        )}

        {booking.status === 'CONFIRMED' && sessionEnded && (
          <div
            className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
              isPaid
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
            <CreditCard size={12} />
            {isPaid ? 'Payment received' : 'Awaiting payment'}
          </div>
        )}

        {/* REVIEW */}
        {showReviewSection && hasReview && (
          <div className='mt-3 rounded-lg bg-amber-50 px-3 py-2'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-xs mb-1 font-semibold text-amber-700'>
                  Your Review
                </p>

                <StarRating
                  value={booking.review!.rating}
                  size={12}
                />

                {booking.review!.comment && (
                  <p className='text-xs text-slate-600 line-clamp-2 mt-1'>
                    {booking.review!.comment}
                  </p>
                )}
              </div>

              <button
                onClick={() => onReview!(booking)}
                className='flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition'>
                <Pencil size={12} />
                Edit
              </button>
            </div>
          </div>
        )}

        {viewAs === 'tutor' && hasReview && (
          <div className='mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-xs'>
            <StarRating
              value={booking.review!.rating}
              size={12}
            />
            <p className='text-slate-600 line-clamp-2 mt-1'>
              {booking.review!.comment}
            </p>
          </div>
        )}

        {hasActions && (
          <div className='mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2'>
            {viewAs === 'student' &&
              booking.status === 'CONFIRMED' &&
              sessionEnded &&
              !isPaid && (
                <Button
                  size='sm'
                  className='flex-1 bg-indigo-600 hover:bg-indigo-500 text-white'
                  onClick={handlePayNow}
                  loading={isPaymentLoading}>
                  Pay ৳{booking.price.toFixed(0)}
                </Button>
              )}

            {viewAs === 'student' &&
              booking.status === 'CONFIRMED' &&
              !sessionEnded &&
              onStatusChange && (
                <Button
                  size='sm'
                  variant='danger'
                  onClick={() => onStatusChange(booking.id, 'CANCELLED')}
                  loading={isUpdating}
                  className='ml-auto gap-1.5'>
                  <XCircle size={14} />
                  Cancel
                </Button>
              )}

            {showReviewSection && !hasReview && (
              <Button
                size='sm'
                className='w-full bg-indigo-600 hover:bg-indigo-500 text-white'
                onClick={() => onReview!(booking)}>
                <Pencil size={14} />
                Leave a Review
              </Button>
            )}

            {viewAs === 'tutor' &&
              booking.status === 'CONFIRMED' &&
              onStatusChange && (
                <>
                  <Button
                    size='sm'
                    className='flex-1'
                    loading={isUpdating}
                    disabled={!sessionEnded || !isPaid}
                    onClick={() => onStatusChange(booking.id, 'COMPLETED')}>
                    Mark Complete
                  </Button>

                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => onStatusChange(booking.id, 'CANCELLED')}
                    className='gap-1.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600'>
                    <XCircle size={14} />
                    Cancel
                  </Button>
                </>
              )}
          </div>
        )}
      </div>
    </div>
  )
}
