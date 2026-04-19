'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/use-auth'
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { Suspense } from 'react'

const DASHBOARD_HREF: Record<string, string> = {
  STUDENT: '/dashboard',
  TUTOR: '/tutor/dashboard',
  ADMIN: '/admin/dashboard',
}

const ROLE_LABEL: Record<string, string> = {
  STUDENT: 'Student',
  TUTOR: 'Tutor',
  ADMIN: 'Admin',
  GUEST: 'Guest',
}

function UnauthorizedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const requiredRole = searchParams.get('requiredRole') ?? ''
  const page = searchParams.get('page') ?? 'that page'

  const currentRole = user?.role ?? 'GUEST'
  const currentLabel = ROLE_LABEL[currentRole] ?? currentRole
  const requiredLabel = ROLE_LABEL[requiredRole] ?? requiredRole
  const dashboardHref = DASHBOARD_HREF[currentRole] ?? '/'

  return (
    <div className='mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center'>
      {/* Icon */}
      <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50'>
        <ShieldAlert size={36} className='text-rose-500' />
      </div>

      {/* Heading */}
      <h1 className='text-2xl font-extrabold text-slate-900'>
        Access Restricted
      </h1>

      {/* Message */}
      <p className='mt-4 text-base leading-relaxed text-slate-500'>
        You tried to access{' '}
        <span className='font-semibold text-slate-700'>{page}</span>, which is
        only available to{' '}
        <span className='font-semibold text-indigo-600'>
          {requiredLabel} accounts
        </span>
        .
      </p>

      {user ? (
        <p className='mt-2 text-sm text-slate-400'>
          You are currently logged in as a{' '}
          <span className='font-medium text-slate-600'>{currentLabel}</span>.
        </p>
      ) : (
        <p className='mt-2 text-sm text-slate-400'>
          You are not logged in. Please sign in with the correct account.
        </p>
      )}

      {/* Divider */}
      <div className='my-8 h-px w-full bg-slate-100' />

      {/* Actions */}
      <div className='flex flex-col items-center gap-3 sm:flex-row'>
        <Button
          variant='secondary'
          className='gap-2'
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Go Back
        </Button>

        {user ? (
          <Link href={dashboardHref}>
            <Button className='gap-2'>
              <LayoutDashboard size={16} />
              Go to My Dashboard
            </Button>
          </Link>
        ) : (
          <Link href='/login'>
            <Button className='gap-2'>Log In</Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default function UnauthorizedPage() {
  return (
    <Suspense>
      <UnauthorizedContent />
    </Suspense>
  )
}
