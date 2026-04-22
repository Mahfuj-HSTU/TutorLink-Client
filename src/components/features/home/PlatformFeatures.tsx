import {
  BadgeCheck,
  ShieldCheck,
  CalendarDays,
  Video,
  Lock,
  BookOpen,
  TrendingUp
} from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified Expert Tutors',
    description:
      'Every tutor is background-checked and skill-verified before joining. Only the best make it through.',
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    icon: CalendarDays,
    title: 'Flexible Scheduling',
    description:
      'Book sessions that fit your life — mornings, evenings, or weekends. You always pick the time.',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    icon: Video,
    title: 'Live Online Sessions',
    description:
      'High-quality video with screen sharing and whiteboard tools built right in. No extra setup.',
    gradient: 'from-sky-500 to-cyan-500'
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description:
      'Industry-standard encryption and escrow payments protect every transaction, every time.',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    icon: BookOpen,
    title: 'Every Subject & Level',
    description:
      'From primary school maths to advanced programming — expert tutors across 50+ subjects.',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description:
      'Session history, tutor notes, and learning milestones — all visible in your dashboard.',
    gradient: 'from-rose-500 to-pink-500'
  }
]

export default function PlatformFeatures() {
  return (
    <section className='relative overflow-hidden bg-slate-50 py-10 sm:py-20'>
      <div className='pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-100 opacity-50 blur-3xl' />
      <div className='pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-purple-100 opacity-50 blur-3xl' />
      <div className='absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-200 to-transparent' />
      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm sm:gap-2 sm:px-4 sm:py-1.5 sm:text-sm'>
            <BadgeCheck
              size={12}
              className='text-indigo-500 sm:size-3'
            />
            Why TutorLink?
          </span>
          <h2 className='mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:mt-5 sm:text-4xl lg:text-5xl'>
            Everything you need to{' '}
            <span className='bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              learn faster
            </span>
          </h2>
          <p className='mt-3 text-sm leading-relaxed text-slate-500 sm:mt-5 sm:text-lg'>
            We built every feature around one goal — helping students make real,
            measurable progress.
          </p>
        </div>
        <div className='mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-3'>
          {features.map(({ icon: Icon, title, description, gradient }) => (
            <div
              key={title}
              className='group relative overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-indigo-200 sm:p-7'>
              <div className='flex items-center gap-2 sm:gap-3'>
                <div
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${gradient} shadow-sm sm:h-10 sm:w-10`}>
                  <Icon
                    size={15}
                    className='text-white sm:size-5'
                  />
                </div>
                <h3 className='text-xs font-bold text-slate-900 sm:text-base'>
                  {title}
                </h3>
              </div>
              <p className='mt-2.5 text-xs leading-relaxed text-slate-500 sm:mt-4 sm:text-sm'>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
