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
  AlertCircle,
  ArrowRight,
  ShieldCheck
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
  const { accent, gradient, badge, avatar, label, Icon } =
    statusConfig[booking.status]

  const handlePayNow = async () => {
    try {
      const res = await initPayment({ bookingId: booking.id }).unwrap()
      window.location.href = res.data.gatewayUrl
    } catch {
      toast.error('Could not initiate payment. Please try again.')
    }
  }

  return (
    <div className='group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 hover:shadow-md hover:ring-slate-300'>
      {/* Status accent bar */}
      <div className={`h-1 w-full ${accent}`} />

      {/* Subtle gradient wash */}
      <div
        className={`pointer-events-none absolute inset-0 top-1 bg-linear-to-br ${gradient}`}
      />

      <div className='relative'>
        {/* ── Header ─────────────────────────────────────── */}
        <div className='flex items-start gap-4 px-5 pt-5 pb-4'>
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${avatar}`}>
            {getInitials(counterpart?.name)}
          </div>

          <div className='min-w-0 flex-1'>
            <p className='truncate text-sm font-semibold text-slate-900'>
              {counterpart?.name ?? '—'}
            </p>
            <div className='mt-1.5 flex items-center gap-1.5'>
              <Icon
                size={11}
                className='shrink-0 opacity-60'
              />
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badge}`}>
                {label}
              </span>
            </div>
          </div>

          <div className='shrink-0 text-right'>
            <p className='text-[10px] font-medium uppercase tracking-wide text-slate-400'>
              Fee
            </p>
            <p className='text-xl font-bold text-slate-900'>
              ৳{booking.price.toFixed(0)}
            </p>
          </div>
        </div>

        <div className='mx-5 h-px bg-slate-100' />

        {/* ── Schedule ───────────────────────────────────── */}
        <div className='flex items-center gap-3 px-5 py-4'>
          <div className='flex flex-1 flex-col gap-2 min-w-0'>
            <div className='flex items-center gap-2'>
              <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-50'>
                <CalendarDays
                  size={12}
                  className='text-indigo-500'
                />
              </span>
              <span className='text-xs font-medium text-slate-700'>
                {formatDateTime(booking.startTime)}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-50'>
                <Clock
                  size={12}
                  className='text-slate-400'
                />
              </span>
              <span className='text-xs text-slate-400'>
                Ends {formatDateTime(booking.endTime)}
              </span>
            </div>
          </div>
          <span className='shrink-0 flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm'>
            <Timer size={11} />
            {getDuration(booking.startTime, booking.endTime)}
          </span>
        </div>

        {/* ── Student's question ─────────────────────────── */}
        {booking.questions && (
          <div className='mx-5 mb-4'>
            <div className='flex gap-2.5 rounded-xl border border-slate-100 bg-slate-50 px-3.5 py-3'>
              <MessageSquare
                size={13}
                className='mt-0.5 shrink-0 text-indigo-400'
              />
              <p className='text-xs leading-relaxed text-slate-600 line-clamp-3'>
                {booking.questions}
              </p>
            </div>
          </div>
        )}

        {/* ── Payment status chip ────────────────────────── */}
        {booking.status === 'CONFIRMED' && sessionEnded && (
          <div className='mx-5 mb-4'>
            <div
              className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs font-medium ring-1 ring-inset ${
                isPaid
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
                  : 'bg-amber-50 text-amber-700 ring-amber-200'
              }`}>
              <span
                className={`h-1.5 w-1.5 rounded-full ${isPaid ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}
              />
              <CreditCard size={12} />
              {isPaid
                ? `Payment received · ৳${(booking.payment?.amount ?? booking.price).toFixed(0)}`
                : 'Awaiting payment from student'}
            </div>
          </div>
        )}

        {/* ── Student review (editable) ──────────────────── */}
        {showReviewSection && hasReview && (
          <div className='mx-5 mb-4'>
            <div className='rounded-xl border border-amber-100 bg-linear-to-r from-amber-50 to-orange-50/40 px-4 py-3'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex flex-col gap-1.5'>
                  <p className='text-xs font-semibold text-amber-700'>
                    Your Review
                  </p>
                  <StarRating
                    value={booking.review!.rating}
                    size={13}
                  />
                  {booking.review!.comment && (
                    <p className='mt-0.5 line-clamp-2 text-xs text-slate-600'>
                      {booking.review!.comment}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onReview!(booking)}
                  className='shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-amber-100 hover:text-indigo-600'
                  title='Edit review'>
                  <Pencil size={13} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Tutor read-only review ─────────────────────── */}
        {viewAs === 'tutor' && hasReview && (
          <div className='mx-5 mb-4'>
            <div className='rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50 to-violet-50/40 px-4 py-3'>
              <p className='mb-1.5 text-xs font-semibold text-indigo-700'>
                Student Review
              </p>
              <StarRating
                value={booking.review!.rating}
                size={13}
              />
              {booking.review!.comment && (
                <p className='mt-1 line-clamp-3 text-xs text-slate-600'>
                  {booking.review!.comment}
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Student: Pay Now ───────────────────────────── */}
        {viewAs === 'student' &&
          booking.status === 'CONFIRMED' &&
          sessionEnded &&
          !isPaid && (
            <div className='border-t border-slate-100 px-5 py-4'>
              <Button
                size='sm'
                className='w-full gap-2 bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-sm hover:from-emerald-500 hover:to-teal-500'
                onClick={handlePayNow}
                loading={isPaymentLoading}>
                <CreditCard size={14} />
                Pay ৳{booking.price.toFixed(0)} Now
                <ArrowRight
                  size={14}
                  className='ml-auto'
                />
              </Button>
              <p className='mt-2 flex items-center justify-center gap-1 text-center text-xs text-slate-400'>
                <ShieldCheck size={11} />
                Secured by SSLCommerz
              </p>
            </div>
          )}

        {/* ── Tutor actions ──────────────────────────────── */}
        {viewAs === 'tutor' &&
          booking.status === 'CONFIRMED' &&
          onStatusChange && (
            <div className='border-t border-slate-100 px-5 py-4'>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  onClick={() => onStatusChange(booking.id, 'COMPLETED')}
                  loading={isUpdating}
                  disabled={!sessionEnded || !isPaid}
                  className='flex-1 gap-1.5'>
                  <CheckCircle2 size={14} />
                  Mark Complete
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onStatusChange(booking.id, 'CANCELLED')}
                  loading={isUpdating}
                  className='gap-1.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600'>
                  <XCircle size={14} />
                  Cancel
                </Button>
              </div>
              {(!sessionEnded || !isPaid) && (
                <p className='mt-2 text-center text-xs text-slate-400'>
                  {!sessionEnded
                    ? `Unlocks after session ends · ${new Date(booking.endTime).toLocaleString()}`
                    : 'Waiting for student payment'}
                </p>
              )}
            </div>
          )}

        {/* ── Student: Cancel (before session ends only) ──── */}
        {viewAs === 'student' &&
          booking.status === 'CONFIRMED' &&
          !sessionEnded &&
          onStatusChange && (
            <div className='border-t border-slate-100 px-5 py-4'>
              <Button
                size='sm'
                variant='ghost'
                onClick={() => onStatusChange(booking.id, 'CANCELLED')}
                loading={isUpdating}
                className='gap-1.5 border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600'>
                <XCircle size={14} />
                Cancel Session
              </Button>
            </div>
          )}

        {/* ── Student: Leave review ──────────────────────── */}
        {showReviewSection && !hasReview && (
          <div className='border-t border-slate-100 px-5 py-4'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => onReview!(booking)}
              className='gap-1.5'>
              <Pencil size={13} />
              Leave a Review
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
