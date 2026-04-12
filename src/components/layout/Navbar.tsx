'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { signOut } from '@/lib/auth-client'
import { useAuth } from '@/lib/use-auth'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const roleLinks: Record<string, { label: string; href: string }[]> = {
  STUDENT: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Bookings', href: '/bookings' },
    { label: 'Profile', href: '/profile' }
  ],
  TUTOR: [
    { label: 'Dashboard', href: '/tutor/dashboard' },
    { label: 'Bookings', href: '/tutor/bookings' },
    { label: 'Profile', href: '/tutor/profile' }
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Categories', href: '/admin/categories' }
  ]
}

export default function Navbar() {
  const router = useRouter()
  const { user } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    router.refresh()
  }

  const dashboardLinks = user ? (roleLinks[user.role] ?? []) : []

  return (
    <header className='sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60'>
      <nav className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Logo */}
        <Link href='/'>
          <Image
            src='/logo.png'
            alt='TutorLink'
            width={140}
            height={30}
            className='h-12 w-auto'
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className='hidden items-center gap-6 md:flex'>
          <Link
            href='/tutors'
            className='text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors'>
            Find Tutors
          </Link>

          {user ? (
            <div className='relative'>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className='flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors'>
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className='h-6 w-6 rounded-full object-cover'
                  />
                ) : (
                  <span className='flex h-6 w-6 items-center justify-center rounded-full bg-indigo-200 text-xs font-bold text-indigo-700'>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                {user.name.split(' ')[0]}
                <ChevronDown size={14} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className='fixed inset-0'
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className='absolute right-0 top-full mt-2 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg'>
                    {dashboardLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setDropdownOpen(false)}
                        className='block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors'>
                        {link.label}
                      </Link>
                    ))}
                    <hr className='my-1 border-slate-200' />
                    <button
                      onClick={handleSignOut}
                      className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors'>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-3'>
              <Link href='/login'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='cursor-pointer'>
                  Log In
                </Button>
              </Link>
              <Link href='/register'>
                <Button
                  size='sm'
                  className='cursor-pointer'>
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className='rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden'>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 md:hidden',
          mobileOpen ? 'max-h-screen' : 'max-h-0'
        )}>
        <div className='border-t border-slate-200 px-4 py-4 space-y-2'>
          <Link
            href='/tutors'
            onClick={() => setMobileOpen(false)}
            className='block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50'>
            Find Tutors
          </Link>
          {user ? (
            <>
              {dashboardLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className='block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50'>
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  handleSignOut()
                  setMobileOpen(false)
                }}
                className='w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50'>
                Sign Out
              </button>
            </>
          ) : (
            <div className='flex flex-col gap-2 pt-2'>
              <Link
                href='/login'
                onClick={() => setMobileOpen(false)}>
                <Button
                  variant='outline'
                  className='w-full'
                  size='sm'>
                  Log In
                </Button>
              </Link>
              <Link
                href='/register'
                onClick={() => setMobileOpen(false)}>
                <Button
                  className='w-full'
                  size='sm'>
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
