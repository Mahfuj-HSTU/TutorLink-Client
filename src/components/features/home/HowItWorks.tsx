import { Search, CalendarCheck, Video, Star } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Search Tutors',
    description:
      'Filter by subject, price range, teaching mode, and rating to find the perfect match.'
  },
  {
    icon: CalendarCheck,
    title: 'Book a Session',
    description:
      'Pick a time that suits you and confirm your booking instantly — no back-and-forth emails.'
  },
  {
    icon: Video,
    title: 'Start Learning',
    description:
      'Attend your session online or in person and get personalised guidance from your tutor.'
  },
  {
    icon: Star,
    title: 'Leave a Review',
    description:
      'Rate your session and help other learners find the best tutors on the platform.'
  }
]

export default function HowItWorks() {
  return (
    <section
      id='how-it-works'
      className='py-10 sm:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl'>
            How TutorLink Works
          </h2>
          <p className='mt-3 text-sm text-slate-500 sm:mt-4 sm:text-lg'>
            Four simple steps from discovery to learning.
          </p>
        </div>
        <div className='relative mt-10 sm:mt-14'>
          <div className='pointer-events-none absolute left-[12.5%] right-[12.5%] top-6 hidden h-0.5 bg-indigo-100 lg:top-7 lg:block' />

          <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8'>
            {steps.map(({ icon: Icon, title, description }, idx) => (
              <div
                key={title}
                className='flex flex-col items-center text-center'>
                <div className='relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg sm:h-14 sm:w-14'>
                  <Icon
                    size={20}
                    className='sm:size-6'
                  />
                  <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-900 sm:h-6 sm:w-6 sm:text-xs'>
                    {idx + 1}
                  </span>
                </div>
                <h3 className='mt-4 text-sm font-semibold text-slate-900 sm:mt-5 sm:text-base'>
                  {title}
                </h3>
                <p className='mt-1.5 text-xs leading-relaxed text-slate-500 sm:mt-2 sm:text-sm'>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
