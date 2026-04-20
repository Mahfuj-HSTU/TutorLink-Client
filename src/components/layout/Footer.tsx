/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, ExternalLink, Globe } from 'lucide-react'
import { useAuth } from '@/lib/use-auth'
import { useState, useEffect } from 'react'

type Role = 'GUEST' | 'STUDENT' | 'TUTOR' | 'ADMIN'

interface NavLink {
  label: string
  href: string
  // null = public (anyone can visit). Otherwise only these roles may visit.
  allowedRoles: Role[] | null
}

const LEARNER_LINKS: NavLink[] = [
  { label: 'Find a Tutor', href: '/tutors', allowedRoles: null },
  { label: 'Browse Subjects', href: '/subjects', allowedRoles: null },
  { label: 'How It Works', href: '/#how-it-works', allowedRoles: null },
  { label: 'Student Dashboard', href: '/dashboard', allowedRoles: ['STUDENT'] },
  { label: 'My Bookings', href: '/bookings', allowedRoles: ['STUDENT'] }
]

const TUTOR_LINKS: NavLink[] = [
  {
    label: 'Become a Tutor',
    href: '/register',
    allowedRoles: ['GUEST', 'STUDENT']
  },
  {
    label: 'Tutor Dashboard',
    href: '/tutor/dashboard',
    allowedRoles: ['TUTOR']
  },
  { label: 'Manage Profile', href: '/tutor/profile', allowedRoles: ['TUTOR'] },
  { label: 'My Bookings', href: '/tutor/bookings', allowedRoles: ['TUTOR'] }
]

export default function Footer() {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const role: Role = mounted && user ? (user.role as Role) : 'GUEST'

  const handleClick = (item: NavLink) => {
    // Public link — always navigate
    if (item.allowedRoles === null) {
      router.push(item.href)
      return
    }

    // Not logged in — redirect to login
    if (!mounted || !user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(item.href)}`)
      return
    }

    // Role matches — navigate
    if (item.allowedRoles.includes(role)) {
      router.push(item.href)
      return
    }

    const requiredRole = item.allowedRoles.find((r) => r !== 'GUEST') ?? ''
    router.push(
      `/unauthorized?page=${encodeURIComponent(item.label)}&requiredRole=${requiredRole}`
    )
  }

  const renderLinks = (links: NavLink[]) =>
    links.map((item) => (
      <li key={item.label}>
        <button
          onClick={() => handleClick(item)}
          className='text-left text-sm text-slate-500 transition-colors hover:text-indigo-600'>
          {item.label}
        </button>
      </li>
    ))

  return (
    <footer className='border-t border-slate-200 bg-slate-50'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          {/* Brand */}
          <div className='col-span-1 md:col-span-2'>
            <Link href='/'>
              <Image
                src='/logo.png'
                alt='TutorLink'
                width={120}
                height={40}
                className='h-9 w-auto'
              />
            </Link>
            <p className='mt-3 max-w-xs text-sm text-slate-500'>
              Connecting learners with expert tutors for a personalised,
              flexible learning experience — online or in person.
            </p>
            <div className='mt-4 flex items-center gap-3'>
              <a
                href='#'
                className='rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors'>
                <ExternalLink size={16} />
              </a>
              <a
                href='#'
                className='rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors'>
                <Globe size={16} />
              </a>
              <a
                href='mailto:hello@tutorlink.com'
                className='rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors'>
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* For Learners */}
          <div>
            <h3 className='text-sm font-semibold text-slate-900'>
              For Learners
            </h3>
            <ul className='mt-3 space-y-2'>{renderLinks(LEARNER_LINKS)}</ul>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className='text-sm font-semibold text-slate-900'>For Tutors</h3>
            <ul className='mt-3 space-y-2'>{renderLinks(TUTOR_LINKS)}</ul>
          </div>
        </div>

        <div className='mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400'>
          &copy; {new Date().getFullYear()} TutorLink. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
