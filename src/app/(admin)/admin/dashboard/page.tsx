'use client'

import { useGetAllUsersQuery } from '@/lib/redux/api/adminApi'
import { useGetTutorsQuery } from '@/lib/redux/api/tutorApi'
import { useGetCategoriesQuery } from '@/lib/redux/api/categoryApi'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Card, CardBody } from '@/components/ui/Card'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Users, GraduationCap, BookOpen, ShieldAlert } from 'lucide-react'

export default function AdminDashboardPage() {
  const { data: usersData, isLoading: loadingUsers } = useGetAllUsersQuery()
  const { data: tutorsData, isLoading: loadingTutors } = useGetTutorsQuery({})
  const { data: catsData, isLoading: loadingCats } = useGetCategoriesQuery()

  const users = usersData?.data ?? []
  const tutors = tutorsData?.data ?? []
  const categories = catsData?.data ?? []

  const students = users.filter((u) => u.role === 'STUDENT')
  const bannedUsers = users.filter((u) => u.isBanned)

  if (loadingUsers || loadingTutors || loadingCats)
    return <LoadingSpinner fullPage />

  return (
    <div className='flex flex-col gap-8'>
      {/* Banner */}
      <div className='rounded-2xl bg-linear-to-r from-slate-800 to-slate-600 p-6 text-white'>
        <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
        <p className='mt-1 text-slate-300'>
          Platform overview and management tools.
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {[
          {
            label: 'Total Users',
            value: users.length,
            icon: Users,
            color: 'text-indigo-600 bg-indigo-50',
            href: '/admin/users'
          },
          {
            label: 'Tutors',
            value: tutors.length,
            icon: GraduationCap,
            color: 'text-purple-600 bg-purple-50',
            href: '/admin/users'
          },
          {
            label: 'Students',
            value: students.length,
            icon: Users,
            color: 'text-emerald-600 bg-emerald-50',
            href: '/admin/users'
          },
          {
            label: 'Banned Users',
            value: bannedUsers.length,
            icon: ShieldAlert,
            color: 'text-red-600 bg-red-50',
            href: '/admin/users'
          }
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}>
            <Card className='hover:shadow-md transition-shadow cursor-pointer'>
              <CardBody className='flex items-center gap-4'>
                <div className={`rounded-xl p-3 ${color}`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className='text-2xl font-bold text-slate-900'>{value}</p>
                  <p className='text-sm text-slate-500'>{label}</p>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <Card>
          <CardBody className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-indigo-50 p-3 text-indigo-600'>
                <Users size={20} />
              </div>
              <div>
                <p className='font-semibold text-slate-900'>Manage Users</p>
                <p className='text-sm text-slate-500'>Ban / unban accounts</p>
              </div>
            </div>
            <Link href='/admin/users'>
              <Button
                size='sm'
                variant='outline'>
                Open
              </Button>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardBody className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-xl bg-purple-50 p-3 text-purple-600'>
                <BookOpen size={20} />
              </div>
              <div>
                <p className='font-semibold text-slate-900'>Categories</p>
                <p className='text-sm text-slate-500'>
                  {categories.length} subjects
                </p>
              </div>
            </div>
            <Link href='/admin/categories'>
              <Button
                size='sm'
                variant='outline'>
                Open
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
