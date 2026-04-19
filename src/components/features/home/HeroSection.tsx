/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useAuth } from '@/lib/use-auth'
import { useState, useEffect } from 'react'
import {
  Search,
  Star,
  Users,
  CalendarDays,
  LayoutDashboard,
  Shield,
  GraduationCap,
  Sparkles
} from 'lucide-react'

type CTA = {
  label: string
  href: string
  icon: React.ReactNode
  variant?: 'primary' | 'outline'
}

type HeroContent = {
  badge: { icon: React.ReactNode; text: string }
  headlinePlain: string
  headlineHighlight: string
  headlineSuffix: string
  subtitle: string
  ctas: CTA[]
}

const CONTENT: Record<string, HeroContent> = {
  GUEST: {
    badge: {
      icon: (
        <Star
          size={14}
          className='fill-indigo-400 text-indigo-400'
        />
      ),
      text: 'Trusted by 10,000+ learners'
    },
    headlinePlain: 'Learn from the',
    headlineHighlight: 'Best Tutors',
    headlineSuffix: '— on Your Schedule',
    subtitle:
      'TutorLink connects you with verified expert tutors across every subject. Book sessions online or in-person, at a time that works for you.',
    ctas: [
      {
        label: 'Find a Tutor',
        href: '/tutors',
        icon: <Search size={18} />,
        variant: 'primary'
      },
      {
        label: 'Become a Tutor',
        href: '/register',
        icon: <Users size={18} />,
        variant: 'outline'
      }
    ]
  },
  STUDENT: {
    badge: {
      icon: (
        <Sparkles
          size={14}
          className='fill-indigo-400 text-indigo-400'
        />
      ),
      text: 'Welcome back — ready to learn?'
    },
    headlinePlain: 'Find Your Perfect',
    headlineHighlight: 'Expert Tutor',
    headlineSuffix: '& Start Learning Today',
    subtitle:
      'Browse verified tutors across every subject and skill level. Book a session that fits your schedule and start making progress today.',
    ctas: [
      {
        label: 'Find a Tutor',
        href: '/tutors',
        icon: <Search size={18} />,
        variant: 'primary'
      },
      {
        label: 'My Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard size={18} />,
        variant: 'outline'
      }
    ]
  },
  TUTOR: {
    badge: {
      icon: (
        <GraduationCap
          size={14}
          className='text-indigo-500'
        />
      ),
      text: 'Welcome back — your students are waiting'
    },
    headlinePlain: 'Manage Your Sessions &',
    headlineHighlight: 'Grow Your Teaching',
    headlineSuffix: 'at Your Own Pace',
    subtitle:
      'View upcoming bookings, track your schedule, and make a real impact. Your expertise helps students achieve their goals every day.',
    ctas: [
      {
        label: 'My Bookings',
        href: '/tutor/bookings',
        icon: <CalendarDays size={18} />,
        variant: 'primary'
      },
      {
        label: 'My Dashboard',
        href: '/tutor/dashboard',
        icon: <LayoutDashboard size={18} />,
        variant: 'outline'
      }
    ]
  },
  ADMIN: {
    badge: {
      icon: (
        <Shield
          size={14}
          className='text-indigo-500'
        />
      ),
      text: 'Admin — full platform access'
    },
    headlinePlain: 'Keep TutorLink',
    headlineHighlight: 'Running Smoothly',
    headlineSuffix: '— All in One Place',
    subtitle:
      'Monitor platform activity, manage users and categories, and ensure a safe, high-quality experience for every tutor and student.',
    ctas: [
      {
        label: 'Admin Dashboard',
        href: '/admin/dashboard',
        icon: <Shield size={18} />,
        variant: 'primary'
      },
      {
        label: 'Manage Users',
        href: '/admin/users',
        icon: <Users size={18} />,
        variant: 'outline'
      }
    ]
  }
}

export default function HeroSection() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const content =
    mounted && user ? (CONTENT[user.role] ?? CONTENT.GUEST) : CONTENT.GUEST

  return (
    <section className='relative overflow-hidden bg-linear-to-br from-indigo-100 via-white to-purple-100 py-20 sm:py-28'>
      <div className='absolute -right-40 -top-40 h-96 w-96 rounded-full bg-indigo-100 opacity-60 blur-3xl' />
      <div className='absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-100 opacity-60 blur-3xl' />

      <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <span className='inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700'>
            {content.badge.icon}
            {content.badge.text}
          </span>

          <h1 className='mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl'>
            {content.headlinePlain}{' '}
            <span className='text-indigo-600'>{content.headlineHighlight}</span>{' '}
            {content.headlineSuffix}
          </h1>

          <p className='mt-6 text-lg leading-relaxed text-slate-600'>
            {content.subtitle}
          </p>

          <div className='mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
            {content.ctas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}>
                <Button
                  variant={cta.variant ?? 'primary'}
                  size='lg'
                  className='gap-2'>
                  {cta.icon}
                  {cta.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className='mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4'>
          {[
            { value: '500+', label: 'Expert Tutors' },
            { value: '10k+', label: 'Students' },
            { value: '50+', label: 'Subjects' },
            { value: '4.9★', label: 'Avg. Rating' }
          ].map((stat) => (
            <div
              key={stat.label}
              className='rounded-2xl border border-slate-200 bg-white/80 p-5 text-center shadow-sm backdrop-blur'>
              <p className='text-3xl font-extrabold text-indigo-600'>
                {stat.value}
              </p>
              <p className='mt-1 text-sm text-slate-500'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
