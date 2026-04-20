import {
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
      'Every tutor is background-checked and skill-verified before joining the platform.'
  },
  {
    icon: CalendarDays,
    title: 'Flexible Scheduling',
    description:
      'Book sessions that fit your life — mornings, evenings, or weekends. You pick the time.'
  },
  {
    icon: Video,
    title: 'Live Online Sessions',
    description:
      'High-quality video calls with screen sharing and whiteboard tools built right in.'
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description:
      'Industry-standard encryption and escrow payments protect every transaction.'
  },
  {
    icon: BookOpen,
    title: 'Every Subject & Level',
    description:
      'From primary school maths to advanced programming — find expertise across 50+ subjects.'
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description:
      'Session history, tutor notes, and learning milestones — all in your personal dashboard.'
  }
]

export default function PlatformFeatures() {
  return (
    <section className='bg-slate-50 py-20 sm:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <span className='inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700'>
            Why TutorLink?
          </span>
          <h2 className='mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
            Everything you need to learn{' '}
            <span className='text-indigo-600'>faster</span>
          </h2>
          <p className='mt-4 text-lg text-slate-600'>
            We built every feature around one goal — helping students make real,
            measurable progress.
          </p>
        </div>

        <div className='mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'>
              <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50'>
                <Icon
                  size={24}
                  className='text-indigo-600'
                />
              </div>
              <h3 className='mt-4 text-base font-semibold text-slate-900'>
                {title}
              </h3>
              <p className='mt-2 text-sm leading-relaxed text-slate-600'>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
