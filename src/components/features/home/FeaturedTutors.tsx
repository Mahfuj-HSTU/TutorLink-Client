import Link from 'next/link'
import { fetchTutors } from '@/lib/server-api'
import TutorCard from '@/components/features/tutors/TutorCard'
import Button from '@/components/ui/Button'

export default async function FeaturedTutors() {
  const tutors = await fetchTutors()
  const score = (t: (typeof tutors)[0]) =>
    t.rating * Math.sqrt(t.totalReviews + 1)
  const featured = [...tutors].sort((a, b) => score(b) - score(a)).slice(0, 4)

  return (
    <section className='py-10 sm:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex items-end justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl'>
              Top-Rated Tutors
            </h2>
            <p className='mt-2 text-sm text-slate-500 sm:mt-3 sm:text-lg'>
              Hand-picked experts with consistently great reviews.
            </p>
          </div>
          <Link
            href='/tutors'
            className='hidden sm:block'>
            <Button
              variant='outline'
              size='sm'>
              See all tutors
            </Button>
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className='mt-10 text-center text-slate-500'>
            No tutors available yet.
          </p>
        ) : (
          <>
            {/* Mobile: horizontal scroll row */}
            <div className='-mx-4 mt-6 flex gap-4 overflow-x-auto px-4 pb-3 sm:hidden'>
              {featured.map((tutor) => (
                <div
                  key={tutor.id}
                  className='w-64 shrink-0 self-stretch'>
                  <TutorCard tutor={tutor} />
                </div>
              ))}
            </div>

            {/* Tablet + Desktop: grid */}
            <div className='mt-10 hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-4'>
              {featured.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                />
              ))}
            </div>
          </>
        )}

        <div className='mt-6 text-center sm:hidden'>
          <Link href='/tutors'>
            <Button variant='outline'>See all tutors</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
