import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { fetchPlatformStats } from '@/lib/server-api'
import {
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Zap
} from 'lucide-react'

function fmt(n: number): string {
  if (n >= 1000) return `${+(n / 1000).toFixed(1)}k+`
  return `${n}+`
}

export const metadata: Metadata = {
  title: 'Teach with Us — TutorLink',
  description:
    'Join 500+ expert tutors on TutorLink. Set your own schedule, earn on your terms, and make a real impact.'
}

const benefits = [
  {
    icon: DollarSign,
    title: 'Earn on Your Terms',
    description:
      'Set your own hourly rate. Top tutors on TutorLink earn over $80/hr. Get paid directly after every session — no delays, no surprises.'
  },
  {
    icon: Clock,
    title: 'Total Flexibility',
    description:
      'Teach when you want, where you want. Set your own availability and minimum hours — your schedule, your rules.'
  },
  {
    icon: Users,
    title: 'A Platform That Works for You',
    description:
      'We handle bookings, payments, and student matching. You focus on teaching — we handle the rest.'
  }
]

const steps = [
  {
    number: '01',
    title: 'Create Your Profile',
    description:
      'Set up your tutor profile in minutes. Add your subjects, qualifications, experience, and hourly rate.'
  },
  {
    number: '02',
    title: 'Set Your Availability',
    description:
      'Choose the days and time slots you are available. Students only see your open hours when booking.'
  },
  {
    number: '03',
    title: 'Start Teaching',
    description:
      'Accept booking requests, meet your students, and start making an impact from day one.'
  }
]

const highlights = [
  'Free to join — no upfront cost',
  'Verified, serious student community',
  'Secure, on-time payments after every session',
  'Dedicated tutor support team',
  'Profile visible to 10,000+ students',
  'Full control over your schedule and rate'
]

export default async function TeachWithUsPage() {
  const stats = await fetchPlatformStats()
  return (
    <div>
      <section className='relative overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 py-24 sm:py-32'>
        <div className='absolute -right-40 -top-40 h-96 w-96 rounded-full bg-white/5 blur-3xl' />
        <div className='absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/5 blur-3xl' />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl text-center'>
            <span className='inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white'>
              <GraduationCap size={14} />
              Join 500+ tutors already earning on TutorLink
            </span>
            <h1 className='mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl'>
              Turn Your Knowledge Into{' '}
              <span className='text-indigo-200'>Meaningful Income</span>
            </h1>
            <p className='mt-6 text-lg leading-relaxed text-indigo-100'>
              Share your expertise, set your own schedule, and earn on your
              terms. Thousands of students on TutorLink are looking for someone
              exactly like you.
            </p>
            <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
              <Link href='/register'>
                <Button
                  size='lg'
                  className='gap-2 bg-white text-indigo-700 hover:bg-indigo-50'>
                  Apply Now — It&apos;s Free
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href='/tutors'>
                <Button
                  size='lg'
                  variant='outline'
                  className='gap-2 border-white/40 text-white hover:bg-white/10'>
                  Browse Tutor Profiles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className='border-b border-slate-200 bg-white py-10'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-2 gap-6 text-center sm:grid-cols-4'>
            {[
              { value: fmt(stats.tutorCount), label: 'Active Tutors' },
              { value: fmt(stats.studentCount), label: 'Students Taught' },
              {
                value: stats.avgHourlyRate
                  ? `৳${Math.floor(stats.avgHourlyRate / 10) * 10}–৳${Math.floor(stats.avgHourlyRate / 10) * 10 + 20}`
                  : '—',
                label: 'Avg. Hourly Rate'
              },
              { value: `${stats.avgRating.toFixed(1)}★`, label: 'Tutor Satisfaction' }
            ].map((s) => (
              <div key={s.label}>
                <p className='text-3xl font-extrabold text-indigo-600'>
                  {s.value}
                </p>
                <p className='mt-1 text-sm text-slate-500'>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className='bg-slate-50 py-20 sm:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
              Why teach on <span className='text-indigo-600'>TutorLink?</span>
            </h2>
            <p className='mt-4 text-lg text-slate-600'>
              We built the platform around tutors — so you can focus entirely on
              what you do best.
            </p>
          </div>
          <div className='mt-12 grid gap-8 sm:grid-cols-3'>
            {benefits.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className='rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>
                <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50'>
                  <Icon
                    size={24}
                    className='text-indigo-600'
                  />
                </div>
                <h3 className='mt-4 text-lg font-semibold text-slate-900'>
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

      {/* How it works */}
      <section className='bg-white py-20 sm:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl'>
              Get started in{' '}
              <span className='text-indigo-600'>3 simple steps</span>
            </h2>
            <p className='mt-4 text-lg text-slate-600'>
              From sign-up to first session in under 24 hours.
            </p>
          </div>
          <div className='mt-14 grid gap-10 sm:grid-cols-3'>
            {steps.map((step, i) => (
              <div
                key={step.number}
                className='relative text-center'>
                {i < steps.length - 1 && (
                  <div className='absolute left-full top-7 hidden h-px w-full -translate-x-1/2 bg-indigo-100 sm:block' />
                )}
                <span className='inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-xl font-extrabold text-indigo-600'>
                  {step.number}
                </span>
                <h3 className='mt-4 text-lg font-semibold text-slate-900'>
                  {step.title}
                </h3>
                <p className='mt-2 text-sm leading-relaxed text-slate-600'>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='bg-linear-to-br from-indigo-50 to-purple-50 py-20 sm:py-24'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow-lg sm:p-14'>
            <div className='grid gap-10 lg:grid-cols-2 lg:items-center'>
              <div>
                <h2 className='text-3xl font-extrabold tracking-tight text-slate-900'>
                  Ready to start teaching?
                </h2>
                <p className='mt-4 text-slate-600'>
                  Join TutorLink today — it&apos;s free to apply and you could
                  be teaching within days.
                </p>
                <ul className='mt-6 space-y-3'>
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className='flex items-center gap-3 text-sm text-slate-700'>
                      <CheckCircle
                        size={16}
                        className='shrink-0 text-indigo-500'
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className='text-center lg:text-left'>
                <div className='inline-block rounded-2xl bg-indigo-50 p-8'>
                  <Zap
                    size={40}
                    className='mx-auto text-indigo-500 lg:mx-0'
                  />
                  <p className='mt-3 text-2xl font-extrabold text-slate-900'>
                    Start in under 5 minutes
                  </p>
                  <p className='mt-2 text-sm text-slate-600'>
                    Create your profile, set your rate, and go live today.
                  </p>
                  <Link
                    href='/register'
                    className='mt-6 inline-block'>
                    <Button
                      size='lg'
                      className='gap-2'>
                      Apply Now — It&apos;s Free
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
