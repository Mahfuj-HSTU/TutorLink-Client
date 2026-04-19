/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import type { TutorProfile } from '@/types'
import StarRating from '@/components/ui/StarRating'
import Badge from '@/components/ui/Badge'
import { MapPin, Monitor, Laptop } from 'lucide-react'

interface TutorCardProps {
  tutor: TutorProfile
}

const teachingModeIcon = {
  ONLINE: <Monitor size={13} />,
  OFFLINE: <MapPin size={13} />,
  BOTH: <Laptop size={13} />
}

const teachingModeLabel = {
  ONLINE: 'Online',
  OFFLINE: 'In-Person',
  BOTH: 'Online & In-Person'
}

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className='group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md'>
      <div className='relative flex items-center gap-4 rounded-t-2xl bg-linear-to-r from-indigo-50 to-purple-50 p-5'>
        {tutor.user.image ? (
          <img
            src={tutor.user.image}
            alt={tutor.user.name}
            className='h-14 w-14 rounded-full border-2 border-white object-cover shadow'
          />
        ) : (
          <div className='flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-indigo-200 text-xl font-bold text-indigo-700 shadow'>
            {tutor.user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className='font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors'>
            {tutor.user.name}
          </p>
          {tutor.isVerified && (
            <Badge
              variant='success'
              className='mt-0.5'>
              Verified
            </Badge>
          )}
        </div>
      </div>

      <div className='flex flex-1 flex-col gap-3 p-5'>
        {tutor.headline && (
          <p className='line-clamp-2 text-sm text-slate-600'>
            {tutor.headline}
          </p>
        )}

        <div className='flex items-center gap-2'>
          <StarRating
            value={tutor.rating}
            size={14}
          />
          <span className='text-xs text-slate-500'>
            {tutor.rating.toFixed(1)} ({tutor.totalReviews})
          </span>
        </div>

        <div className='flex items-center gap-1.5 text-xs text-slate-500'>
          {teachingModeIcon[tutor.teachingMode]}
          {teachingModeLabel[tutor.teachingMode]}
        </div>

        {tutor.categories.length > 0 && (
          <div className='flex flex-wrap gap-1.5'>
            {tutor.categories.slice(0, 3).map((cat) => (
              <Badge
                key={cat.id}
                variant='info'>
                {cat.name}
              </Badge>
            ))}
            {tutor.categories.length > 3 && (
              <Badge variant='default'>+{tutor.categories.length - 3}</Badge>
            )}
          </div>
        )}
      </div>

      <div className='border-t border-slate-200 px-5 py-3 text-right'>
        <span className='text-sm font-bold text-indigo-700'>
          ৳{tutor.hourlyRate}
          <span className='text-xs font-normal text-slate-400'> / hr</span>
        </span>
      </div>
    </Link>
  )
}
