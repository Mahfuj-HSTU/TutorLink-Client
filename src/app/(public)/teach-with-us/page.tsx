import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { fetchPlatformStats, fetchFeaturedTutor } from '@/lib/server-api'
import {
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  Star,
  CalendarCheck,
  Sparkles,
  BadgeCheck
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Teach with Us — TutorLink',
  description:
    'Join 500+ expert tutors on TutorLink. Set your own schedule, earn on your terms, and make a real impact.'
}

function fmt(n: number): string {
  if (n >= 1000) return `${+(n / 1000).toFixed(1)}k+`
  return `${n}+`
}

const benefits = [
  {
    icon: DollarSign,
    gradient: 'from-emerald-500 to-teal-600',
    title: 'Earn on Your Terms',
    description:
      'Set your own hourly rate and get paid directly after every session — no delays, no hidden fees, no surprises.'
  },
  {
    icon: Clock,
    gradient: 'from-violet-500 to-purple-600',
    title: 'Total Flexibility',
    description:
      'Teach when you want, where you want. Set your own schedule and availability — your life, your rules.'
  },
  {
    icon: Users,
    gradient: 'from-indigo-500 to-blue-600',
    title: 'We Handle the Rest',
    description:
      'Bookings, payments, and student matching are all taken care of. You just show up and teach.'
  }
]

const steps = [
  {
    number: '01',
    icon: GraduationCap,
    title: 'Create Your Profile',
    description:
      'Set up your tutor profile in minutes. Add your subjects, qualifications, experience, and hourly rate.'
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Set Your Availability',
    description:
      'Choose the days and time slots that work for you. Students only see your open hours when booking.'
  },
  {
    number: '03',
    icon: Star,
    title: 'Start Teaching & Earning',
    description:
      'Accept booking requests, run your first session, and get paid. It really is that simple.'
  }
]

const highlights = [
  'Free to join — no upfront cost ever',
  'Verified, serious student community',
  'Secure, on-time payments after every session',
  'Dedicated tutor support team',
  'Profile visible to thousands of students',
  'Full control over your schedule and rate'
]

export default async function TeachWithUsPage() {
  const [stats, featured] = await Promise.all([
    fetchPlatformStats(),
    fetchFeaturedTutor()
  ])
  const rateFloor = Math.floor(stats.avgHourlyRate / 10) * 10
  const rateRange = stats.avgHourlyRate
    ? `৳${rateFloor}–৳${rateFloor + 20}`
    : '—'

  const maxActivity = featured ? Math.max(...featured.weeklyActivity, 1) : 1
  const barHeights = featured
    ? featured.weeklyActivity.map((v) =>
        v === 0 ? 4 : Math.max(Math.round((v / maxActivity) * 100), 12)
      )
    : [45, 70, 50, 85, 60, 95, 75]

  return (
    <div className='overflow-hidden'>
      <section className='relative bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 py-24 sm:py-32'>
        <div className='pointer-events-none absolute inset-0'>
          <div className='absolute -left-40 -top-40 h-125 w-125 rounded-full bg-indigo-600/20 blur-3xl' />
          <div className='absolute -bottom-40 -right-20 h-100 w-100 rounded-full bg-purple-600/20 blur-3xl' />
        </div>

        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-16 lg:grid-cols-2'>
            <div>
              <span className='inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-200 backdrop-blur'>
                <Sparkles
                  size={13}
                  className='text-indigo-300'
                />
                Join {fmt(stats.tutorCount)} tutors already earning
              </span>
              <h1 className='mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl'>
                Turn Your Knowledge Into{' '}
                <span className='bg-linear-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent'>
                  Meaningful Income
                </span>
              </h1>
              <p className='mt-6 text-lg leading-relaxed text-slate-400'>
                Share your expertise, set your own schedule, and earn on your
                terms. Thousands of students on TutorLink are looking for
                someone exactly like you.
              </p>
              <div className='mt-10 flex flex-wrap gap-4'>
                <Link href='/register'>
                  <Button
                    size='lg'
                    className='gap-2 bg-indigo-500 text-white hover:bg-indigo-400'>
                    Apply Now — It&apos;s Free
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link href='/tutors'>
                  <Button
                    size='lg'
                    variant='outline'
                    className='gap-2 border-white/20 text-white hover:bg-white/10'>
                    See Tutor Profiles
                  </Button>
                </Link>
              </div>
              <div className='mt-10 flex flex-wrap items-center gap-6'>
                {[
                  { icon: BadgeCheck, text: 'Free to join' },
                  { icon: Star, text: 'Top-rated community' },
                  { icon: TrendingUp, text: 'Grow your income' }
                ].map(({ icon: Icon, text }) => (
                  <span
                    key={text}
                    className='flex items-center gap-2 text-sm text-slate-400'>
                    <Icon
                      size={15}
                      className='text-indigo-400'
                    />
                    {text}
                  </span>
                ))}
              </div>
            </div>

            <div className='relative hidden lg:block'>
              <div className='absolute -inset-4 rounded-3xl bg-indigo-500/10 blur-2xl' />
              <div className='relative rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur'>
                <div className='rounded-xl bg-slate-800/80 p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs font-medium uppercase tracking-wider text-slate-400'>
                        This Month&apos;s Earnings
                      </p>
                      <p className='mt-1 text-4xl font-extrabold text-white'>
                        {featured
                          ? `৳${featured.monthlyEarnings.toLocaleString()}`
                          : '—'}
                      </p>
                    </div>
                    <span className='flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-semibold text-emerald-400'>
                      <TrendingUp size={13} />
                      Est.
                    </span>
                  </div>

                  <div className='mt-6 grid grid-cols-3 gap-4 border-t border-white/10 pt-5'>
                    {[
                      {
                        value: featured
                          ? String(featured.monthlySessionCount)
                          : '—',
                        label: 'Sessions'
                      },
                      {
                        value: featured
                          ? String(featured.monthlyStudentCount)
                          : '—',
                        label: 'Students'
                      },
                      {
                        value: featured
                          ? `${featured.rating.toFixed(1)}★`
                          : '—',
                        label: 'Rating'
                      }
                    ].map((s) => (
                      <div key={s.label}>
                        <p className='text-xl font-bold text-white'>
                          {s.value}
                        </p>
                        <p className='mt-0.5 text-xs text-slate-400'>
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className='mt-5 border-t border-white/10 pt-5'>
                    <p className='mb-3 text-xs font-medium text-slate-400'>
                      Last 7 days
                    </p>
                    <div className='flex items-end gap-1.5 h-12'>
                      {barHeights.map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t ${barHeights[i] === Math.max(...barHeights) ? 'bg-indigo-400' : 'bg-slate-600'}`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <div className='mt-1.5 flex justify-between text-xs text-slate-500'>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                        <span
                          key={i}
                          className='flex-1 text-center'>
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className='mt-5 flex items-center gap-3 rounded-xl bg-indigo-500/10 px-4 py-3'>
                    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-300'>
                      {featured ? featured.displayName[0].toUpperCase() : '?'}
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium text-white'>
                        {featured?.displayName ?? 'Top Tutor'}
                      </p>
                      <p className='text-xs text-slate-400'>
                        {featured
                          ? `${featured.subject} · ${featured.monthsOnPlatform} mo. on TutorLink`
                          : 'Join the platform'}
                      </p>
                    </div>
                    <div className='ml-auto text-right'>
                      <p className='text-sm font-bold text-emerald-400'>
                        {featured ? `৳${featured.hourlyRate}/hr` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='border-y border-slate-200 bg-white'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 divide-x divide-y divide-slate-200 sm:grid-cols-4 sm:divide-y-0'>
            {[
              {
                value: fmt(stats.tutorCount),
                label: 'Active Tutors',
                icon: GraduationCap
              },
              {
                value: fmt(stats.studentCount),
                label: 'Students Taught',
                icon: Users
              },
              { value: rateRange, label: 'Avg. Hourly Rate', icon: DollarSign },
              {
                value: stats.avgRating ? `${stats.avgRating.toFixed(1)}★` : '—',
                label: 'Tutor Satisfaction',
                icon: Star
              }
            ].map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className='flex flex-col items-center gap-1 py-8 text-center'>
                <Icon
                  size={18}
                  className='text-indigo-400'
                />
                <p className='mt-1 text-3xl font-extrabold text-slate-900'>
                  {value}
                </p>
                <p className='text-sm text-slate-500'>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-slate-50 py-20'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <span className='inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm'>
              <Sparkles
                size={13}
                className='text-indigo-500'
              />
              Built for tutors
            </span>
            <h2 className='mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl'>
              Why teach on{' '}
              <span className='bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                TutorLink?
              </span>
            </h2>
            <p className='mt-4 text-lg text-slate-500'>
              We built the platform around tutors — so you can focus entirely on
              what you do best.
            </p>
          </div>

          <div className='mt-14 grid gap-6 sm:grid-cols-3'>
            {benefits.map(({ icon: Icon, gradient, title, description }) => (
              <div
                key={title}
                className='group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-indigo-200'>
                <div className='flex items-center gap-6'>
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br ${gradient} shadow-sm`}>
                    <Icon
                      size={22}
                      className='text-white'
                    />
                  </div>
                  <h3 className='text-xl font-bold text-slate-900'>{title}</h3>
                </div>
                <p className='mt-3 text-sm leading-relaxed text-slate-500'>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='bg-slate-900 py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <span className='inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-medium text-indigo-300'>
              <Sparkles size={13} />
              Simple process
            </span>
            <h2 className='mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
              Up and running in <span className='text-indigo-400'>3 steps</span>
            </h2>
            <p className='mt-4 text-lg text-slate-400'>
              From sign-up to first paid session in under 24 hours.
            </p>
          </div>

          <div className='mt-16 grid gap-8 sm:grid-cols-3'>
            {steps.map(({ number, icon: Icon, title, description }, i) => (
              <div
                key={number}
                className='relative'>
                {i < steps.length - 1 && (
                  <div className='absolute left-full top-6 hidden h-px w-full -translate-x-1/2 bg-indigo-900 sm:block' />
                )}
                <div className='flex items-center gap-4'>
                  <div className='relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 ring-1 ring-indigo-500/30'>
                    <Icon
                      size={20}
                      className='text-indigo-400'
                    />
                    <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white'>
                      {i + 1}
                    </span>
                  </div>
                  <h3 className='text-lg font-bold text-white'>{title}</h3>
                </div>
                <p className='mt-4 text-sm leading-relaxed text-slate-400'>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 py-24'>
        <div className='pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/5 blur-3xl' />

        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div>
              <h2 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
                Ready to start teaching?
              </h2>
              <p className='mt-4 text-lg text-indigo-200'>
                Join TutorLink today — free to apply, and you could be earning
                within days.
              </p>
              <ul className='mt-8 space-y-3'>
                {highlights.map((item) => (
                  <li
                    key={item}
                    className='flex items-center gap-3 text-sm text-indigo-100'>
                    <CheckCircle
                      size={16}
                      className='shrink-0 text-indigo-300'
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className='flex justify-center lg:justify-end'>
              <div className='w-full max-w-sm rounded-2xl bg-white/10 p-8 backdrop-blur ring-1 ring-white/20'>
                <p className='text-sm font-medium text-indigo-200'>
                  Avg. tutor earns
                </p>
                <p className='mt-1 text-5xl font-extrabold text-white'>
                  {rateRange}
                </p>
                <p className='mt-1 text-sm text-indigo-300'>per hour</p>
                <div className='my-6 border-t border-white/15' />
                <p className='text-sm text-indigo-200'>
                  Set your own rate. Top tutors earn significantly more.
                </p>
                <Link
                  href='/register'
                  className='mt-6 block'>
                  <Button
                    size='lg'
                    className='w-full gap-2 bg-white text-indigo-700 hover:bg-indigo-50'>
                    Apply Now — It&apos;s Free
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <p className='mt-3 text-center text-xs text-indigo-300'>
                  No credit card required · Free forever to join
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
