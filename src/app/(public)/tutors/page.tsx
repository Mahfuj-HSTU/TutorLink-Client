import { Suspense } from 'react'
import { fetchTutors } from '@/lib/server-api'
import TutorCard from '@/components/features/tutors/TutorCard'
import TutorFilters from '@/components/features/tutors/TutorFilters'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Users } from 'lucide-react'

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    minRate?: string
    maxRate?: string
  }>
}

export default async function TutorsPage({ searchParams }: PageProps) {
  const sp = await searchParams

  const tutors = await fetchTutors({
    ...(sp.search && { search: sp.search }),
    ...(sp.category && { category: sp.category }),
    ...(sp.minRate && { minRate: Number(sp.minRate) }),
    ...(sp.maxRate && { maxRate: Number(sp.maxRate) })
  })

  return (
    <div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-slate-900'>Find a Tutor</h1>
        <p className='mt-2 text-slate-500'>
          {tutors.length} tutor{tutors.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className='flex flex-col gap-8 lg:flex-row'>
        {/* Sidebar filters — client component, needs Suspense for useSearchParams */}
        <aside className='w-full shrink-0 lg:w-72'>
          <Suspense fallback={<LoadingSpinner size='sm' />}>
            <TutorFilters />
          </Suspense>
        </aside>

        <div className='flex-1'>
          {tutors.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-20 text-slate-400'>
              <Users
                size={48}
                className='mb-4 opacity-30'
              />
              <p className='text-lg font-medium'>No tutors found</p>
              <p className='mt-1 text-sm'>Try adjusting your filters</p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'>
              {tutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
