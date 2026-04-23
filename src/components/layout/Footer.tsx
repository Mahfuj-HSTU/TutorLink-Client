/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Share2, Globe, ExternalLink } from 'lucide-react'
import { useAuth } from '@/lib/use-auth'
import { useState, useEffect } from 'react'

type Role = 'GUEST' | 'STUDENT' | 'TUTOR' | 'ADMIN'

interface NavLink {
  label: string
  href: string
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
  { label: 'Teach with Us', href: '/teach-with-us', allowedRoles: null },
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

const SOCIAL = [
  { icon: Share2, href: '#', label: 'Social' },
  { icon: Globe, href: '#', label: 'Website' },
  { icon: ExternalLink, href: '#', label: 'Community' },
  { icon: Mail, href: 'mailto:hello@tutorlink.com', label: 'Email' }
]

export default function Footer() {
  const { user } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const role: Role = mounted && user ? (user.role as Role) : 'GUEST'

  const handleClick = (item: NavLink) => {
    if (item.allowedRoles === null) {
      router.push(item.href)
      return
    }
    if (!mounted || !user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(item.href)}`)
      return
    }
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
          className='text-left text-sm text-slate-300 transition-colors hover:text-white'>
          {item.label}
        </button>
      </li>
    ))

  return (
    <footer className='bg-slate-900'>
      <div className='mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8'>
          {/* Brand — full width on mobile, 2-col span on lg */}
          <div className='col-span-2 lg:col-span-2'>
            <Link href='/'>
              <Image
                src='/logo.png'
                alt='TutorLink'
                width={130}
                height={40}
                className='h-11 w-auto'
              />
            </Link>
            <p className='mt-4 max-w-sm text-sm leading-relaxed text-slate-300'>
              Connecting learners with expert tutors for a personalised,
              flexible learning experience — online or in person.
            </p>
            <div className='mt-5 flex items-center gap-2'>
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className='flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400'>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* For Learners */}
          <div>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-slate-200'>
              For Learners
            </h3>
            <ul className='mt-4 space-y-2.5'>{renderLinks(LEARNER_LINKS)}</ul>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className='text-xs font-semibold uppercase tracking-wider text-slate-200'>
              For Tutors
            </h3>
            <ul className='mt-4 space-y-2.5'>{renderLinks(TUTOR_LINKS)}</ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className='border-t border-white/10'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6 lg:px-8'>
          <p className='text-xs text-slate-500'>
            &copy; {new Date().getFullYear()} TutorLink. All rights reserved.
          </p>
          <div className='flex items-center gap-5 text-xs text-slate-500'>
            <Link
              href='/'
              className='transition-colors hover:text-slate-300'>
              Privacy Policy
            </Link>
            <Link
              href='/'
              className='transition-colors hover:text-slate-300'>
              Terms of Service
            </Link>
            <Link
              href='/'
              className='transition-colors hover:text-slate-300'>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
