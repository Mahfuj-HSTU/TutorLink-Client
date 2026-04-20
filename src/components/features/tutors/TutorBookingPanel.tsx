'use client'

import { useState, useMemo } from 'react'
import {
  useCreateBookingMutation,
  useGetMyBookingsQuery
} from '@/lib/redux/api/bookingApi'
import { useAuth } from '@/lib/use-auth'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import toast from 'react-hot-toast'
import type { TutorProfile } from '@/types'

interface Props {
  tutor: Pick<TutorProfile, 'id' | 'hourlyRate' | 'isAvailable'> & {
    user: Pick<TutorProfile['user'], 'name'>
  }
}

const PREP_MINUTES = 15
const MIN_SESSION_MINUTES = 60
const SLOT_INTERVAL = 15

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
}

const ALL_SLOTS = generateTimeSlots()

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function getLocalTodayString(): string {
  const now = new Date()
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-')
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-')
}

export default function TutorBookingPanel({ tutor }: Props) {
  const { user } = useAuth()
  const [bookingOpen, setBookingOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [startSlot, setStartSlot] = useState('')
  const [endDate, setEndDate] = useState('')
  const [endSlot, setEndSlot] = useState('')
  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation()

  const { data: myBookingsResp } = useGetMyBookingsQuery(undefined, {
    skip: user?.role !== 'STUDENT'
  })

  const confirmedBookings = useMemo(
    () => (myBookingsResp?.data ?? []).filter((b) => b.status === 'CONFIRMED'),
    [myBookingsResp]
  )

  const hasActiveSameTutorSession = useMemo(
    () => confirmedBookings.some((b) => b.tutorId === tutor.id),
    [confirmedBookings, tutor.id]
  )

  const today = getLocalTodayString()

  const availableStartSlots = useMemo(() => {
    if (!startDate) return []

    let slots = ALL_SLOTS

    if (startDate === today) {
      const now = new Date()
      const nowMins = now.getHours() * 60 + now.getMinutes() + PREP_MINUTES
      const minMins = Math.ceil(nowMins / SLOT_INTERVAL) * SLOT_INTERVAL
      slots = slots.filter((s) => toMinutes(s) >= minMins)
    }

    slots = slots.filter((slot) => {
      const slotDT = new Date(`${startDate}T${slot}:00`)
      return !confirmedBookings.some((b) => {
        const bStart = new Date(b.startTime)
        const bEnd = new Date(b.endTime)
        return slotDT >= bStart && slotDT < bEnd
      })
    })

    return slots
  }, [startDate, today, confirmedBookings])

  const availableEndSlots = useMemo(() => {
    if (!startSlot || !startDate || !endDate) return []
    const startDT = new Date(`${startDate}T${startSlot}:00`)
    const minEndMs = startDT.getTime() + MIN_SESSION_MINUTES * 60 * 1000

    const conflictStarts = confirmedBookings
      .filter((b) => new Date(b.endTime) > startDT)
      .map((b) => new Date(b.startTime).getTime())
    const maxEndMs =
      conflictStarts.length > 0 ? Math.min(...conflictStarts) : Infinity

    return ALL_SLOTS.filter((slot) => {
      const endDT = new Date(`${endDate}T${slot}:00`)
      const ms = endDT.getTime()
      return ms >= minEndMs && ms <= maxEndMs
    })
  }, [startSlot, startDate, endDate, confirmedBookings])

  const handleStartDateChange = (date: string) => {
    setStartDate(date)
    setStartSlot('')
    setEndDate('')
    setEndSlot('')
  }

  const handleStartSlotChange = (slot: string) => {
    setStartSlot(slot)
    const defaultEndMins = toMinutes(slot) + MIN_SESSION_MINUTES

    if (defaultEndMins < 24 * 60) {
      setEndDate(startDate)
      setEndSlot(ALL_SLOTS.find((s) => toMinutes(s) === defaultEndMins) ?? '')
    } else {
      setEndDate(addDays(startDate, 1))
      const overflowMins = defaultEndMins - 24 * 60
      setEndSlot(ALL_SLOTS.find((s) => toMinutes(s) === overflowMins) ?? '')
    }
  }

  const handleEndDateChange = (date: string) => {
    setEndDate(date)
    setEndSlot('')
  }

  const resetForm = () => {
    setStartDate('')
    setStartSlot('')
    setEndDate('')
    setEndSlot('')
  }

  const handleBook = async () => {
    if (!startDate || !startSlot || !endDate || !endSlot) {
      toast.error('Please select both start and end date/time.')
      return
    }
    const start = new Date(`${startDate}T${startSlot}:00`)
    const end = new Date(`${endDate}T${endSlot}:00`)
    if (end.getTime() - start.getTime() < MIN_SESSION_MINUTES * 60 * 1000) {
      toast.error('Session must be at least 1 hour long.')
      return
    }
    try {
      await createBooking({
        tutorId: tutor.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        price: tutor.hourlyRate
      }).unwrap()
      toast.success('Booking confirmed!')
      setBookingOpen(false)
      resetForm()
    } catch {
      toast.error('Could not create booking. Please try again.')
    }
  }

  const selectClass =
    'w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed'

  return (
    <>
      {user?.role === 'STUDENT' && tutor.isAvailable && (
        <div className='relative inline-block group'>
          <Button
            onClick={() => !hasActiveSameTutorSession && setBookingOpen(true)}
            disabled={hasActiveSameTutorSession}>
            Book Session
          </Button>
          {hasActiveSameTutorSession && (
            <div
              role='tooltip'
              className='pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-800 px-3 py-2.5 text-center text-xs leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100'>
              You have an active session with this tutor. Book again after
              it&apos;s completed or cancelled.
              <span className='absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800' />
            </div>
          )}
        </div>
      )}
      {user?.role === 'TUTOR' && (
        <p className='text-sm text-slate-400'>Tutors cannot book sessions.</p>
      )}

      {!user && (
        <Button onClick={() => (window.location.href = '/login')}>
          Login to Book
        </Button>
      )}

      <Modal
        open={bookingOpen}
        onClose={() => {
          setBookingOpen(false)
          resetForm()
        }}
        title={`Book a session with ${tutor.user.name}`}>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>
              Start Date
            </label>
            <input
              type='date'
              min={today}
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className={selectClass}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>
              Start Time
            </label>
            <select
              value={startSlot}
              onChange={(e) => handleStartSlotChange(e.target.value)}
              disabled={!startDate}
              className={selectClass}>
              <option value=''>Select start time</option>
              {availableStartSlots.map((slot) => (
                <option
                  key={slot}
                  value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {startDate === today && (
              <p className='text-xs text-slate-400'>
                Times shown are at least {PREP_MINUTES} min from now
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>
              End Date
            </label>
            <input
              type='date'
              min={startDate || today}
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              disabled={!startSlot}
              className={selectClass}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium text-slate-700'>
              End Time
            </label>
            <select
              value={endSlot}
              onChange={(e) => setEndSlot(e.target.value)}
              disabled={!endDate || !startSlot}
              className={selectClass}>
              <option value=''>Select end time</option>
              {availableEndSlots.map((slot) => (
                <option
                  key={slot}
                  value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <p className='text-xs text-slate-400'>
              Minimum 1 hour after start time
            </p>
          </div>

          <p className='text-sm text-slate-500'>
            Rate:{' '}
            <span className='font-semibold'>৳{tutor.hourlyRate} / hr</span>
          </p>

          <div className='flex justify-end gap-3'>
            <Button
              variant='secondary'
              onClick={() => {
                setBookingOpen(false)
                resetForm()
              }}>
              Cancel
            </Button>
            <Button
              onClick={handleBook}
              loading={isBooking}>
              Confirm Booking
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
