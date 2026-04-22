import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { fetchCategories } from '@/lib/server-api'

export default async function CategoriesSection() {
  const categories = await fetchCategories()

  return (
    <section className='bg-slate-50 py-10 sm:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl'>
            Browse by Subject
          </h2>
          <p className='mt-3 text-sm text-slate-500 sm:mt-4 sm:text-lg'>
            Explore hundreds of topics taught by verified experts.
          </p>
        </div>

        <div className='mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/tutors?category=${cat.slug}`}
              className='group flex flex-col items-center gap-2.5 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md sm:gap-3 sm:p-6'>
              <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white sm:h-12 sm:w-12'>
                <BookOpen
                  size={18}
                  className='sm:size-5.5'
                />
              </div>
              <span className='text-xs font-semibold text-slate-800 group-hover:text-indigo-700 sm:text-sm'>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        <div className='mt-7 text-center sm:mt-10'>
          <Link
            href='/subjects'
            className='text-sm font-medium text-indigo-600 hover:underline'>
            View all subjects →
          </Link>
        </div>
      </div>
    </section>
  )
}
