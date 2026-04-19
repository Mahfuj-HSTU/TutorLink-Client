'use client'

import { useAuth } from '@/lib/use-auth'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { User, Mail, Phone, Shield } from 'lucide-react'
import Image from 'next/image'

export default function StudentProfilePage() {
  const { user } = useAuth()

  if (!user)
    return (
      <div className='py-20 text-center text-slate-400'>Loading profile...</div>
    )

  return (
    <div>
      <h1 className='mb-6 text-2xl font-bold text-slate-900'>My Profile</h1>

      <Card className='max-w-xl'>
        <CardHeader>
          <div className='flex items-center gap-4'>
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                className='h-16 w-16 rounded-full object-cover'
              />
            ) : (
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700'>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className='text-xl font-semibold text-slate-900'>
                {user.name}
              </p>
              <Badge
                variant='info'
                className='mt-1'>
                {user.role}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardBody className='flex flex-col gap-4'>
          <div className='flex items-center gap-3 text-sm text-slate-700'>
            <Mail
              size={16}
              className='text-slate-400'
            />
            {user.email}
            {user.emailVerified && (
              <Badge
                variant='success'
                className='ml-auto'>
                Verified
              </Badge>
            )}
          </div>
          {user.phone && (
            <div className='flex items-center gap-3 text-sm text-slate-700'>
              <Phone
                size={16}
                className='text-slate-400'
              />
              {user.phone}
            </div>
          )}
          <div className='flex items-center gap-3 text-sm text-slate-700'>
            <Shield
              size={16}
              className='text-slate-400'
            />
            Account status:{' '}
            <Badge variant={user.isBanned ? 'danger' : 'success'}>
              {user.isBanned ? 'Banned' : 'Active'}
            </Badge>
          </div>
          <div className='flex items-center gap-3 text-sm text-slate-700'>
            <User
              size={16}
              className='text-slate-400'
            />
            Member since{' '}
            {new Date(user.createdAt).toLocaleDateString('en-US', {
              dateStyle: 'long'
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
