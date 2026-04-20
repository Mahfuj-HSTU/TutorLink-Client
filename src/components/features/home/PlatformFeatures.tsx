import {
  Sparkles,
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
    <section className='relative overflow-hidden bg-slate-50 py-20'>
      <div className='pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-100 opacity-50 blur-3xl' />
      <div className='pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-purple-100 opacity-50 blur-3xl' />
      <div className='absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-200 to-transparent' />
      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm'>
            <Sparkles
              size={13}
              className='text-indigo-500'
            />
            Why TutorLink?
          </span>
          <h2 className='mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
            Everything you need to{' '}
            <span className='bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              learn faster
            </span>
          </h2>
          <p className='mt-5 text-lg leading-relaxed text-slate-500'>
            We built every feature around one goal — helping students make real,
            measurable progress.
          </p>
        </div>
        <div className='mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map(({ icon: Icon, title, description, gradient }) => (
            <div
              key={title}
              className='group relative overflow-hidden rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-indigo-200'>
              <div className='flex items-center gap-3'>
                <div
                  className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ${gradient} shadow-sm`}>
                  <Icon
                    size={19}
                    className='text-white'
                  />
                </div>
                <h3 className='text-base font-bold text-slate-900'>{title}</h3>
              </div>
              <p className='mt-4 text-sm leading-relaxed text-slate-500'>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
