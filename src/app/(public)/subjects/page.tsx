import Link from 'next/link'
import { fetchCategories } from '@/lib/server-api'
import { BookOpen, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse Subjects — TutorLink',
  description: 'Explore all available subjects and find a verified expert tutor for the topic you need.'
}

const PALETTE = [
  { bg: 'bg-indigo-50', icon: 'text-indigo-600', hover: 'group-hover:bg-indigo-600 group-hover:text-white', ring: 'group-hover:ring-indigo-200' },
  { bg: 'bg-purple-50', icon: 'text-purple-600', hover: 'group-hover:bg-purple-600 group-hover:text-white', ring: 'group-hover:ring-purple-200' },
  { bg: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'group-hover:bg-emerald-600 group-hover:text-white', ring: 'group-hover:ring-emerald-200' },
  { bg: 'bg-amber-50', icon: 'text-amber-600', hover: 'group-hover:bg-amber-600 group-hover:text-white', ring: 'group-hover:ring-amber-200' },
  { bg: 'bg-rose-50', icon: 'text-rose-600', hover: 'group-hover:bg-rose-600 group-hover:text-white', ring: 'group-hover:ring-rose-200' },
  { bg: 'bg-sky-50', icon: 'text-sky-600', hover: 'group-hover:bg-sky-600 group-hover:text-white', ring: 'group-hover:ring-sky-200' },
  { bg: 'bg-teal-50', icon: 'text-teal-600', hover: 'group-hover:bg-teal-600 group-hover:text-white', ring: 'group-hover:ring-teal-200' },
  { bg: 'bg-orange-50', icon: 'text-orange-600', hover: 'group-hover:bg-orange-600 group-hover:text-white', ring: 'group-hover:ring-orange-200' },
]

export default async function SubjectsPage() {
  const categories = await fetchCategories()

  return (
    <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
      {/* Page header */}
      <div className='mb-12 text-center'>
        <h1 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
          Browse All Subjects
        </h1>
        <p className='mt-4 text-lg text-slate-500'>
          {categories.length} subject{categories.length !== 1 ? 's' : ''} taught by verified expert tutors.
          Pick a topic to see available tutors.
        </p>
      </div>

      {/* Subject grid */}
      {categories.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-slate-400'>
          <BookOpen size={48} className='mb-4 opacity-30' />
          <p className='text-lg font-medium'>No subjects available yet</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
          {categories.map((cat, i) => {
            const color = PALETTE[i % PALETTE.length]
            return (
              <Link
                key={cat.id}
                href={`/tutors?category=${cat.slug}`}
                className='group flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-md hover:ring-2 hover:ring-offset-1'
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors duration-200 ${color.bg} ${color.icon} ${color.hover}`}
                >
                  <BookOpen size={24} />
                </div>
                <div className='flex-1'>
                  <p className='font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors'>
                    {cat.name}
                  </p>
                </div>
                <span className='flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors'>
                  Browse tutors <ArrowRight size={12} />
                </span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Footer link back to all tutors */}
      <div className='mt-12 text-center'>
        <p className='text-sm text-slate-500'>
          Want to search across all subjects?{' '}
          <Link href='/tutors' className='font-medium text-indigo-600 hover:underline'>
            Browse all tutors →
          </Link>
        </p>
      </div>
    </div>
  )
}
