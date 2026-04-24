/* eslint-disable react-hooks/set-state-in-effect */
'use client'

import { useState, useEffect } from 'react'
import { useGetCategoriesQuery } from '@/lib/redux/api/categoryApi'
import {
  useGetMyTutorProfileQuery,
  useUpdateTutorCategoriesMutation
} from '@/lib/redux/api/tutorApi'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import toast from 'react-hot-toast'
import { BookOpen, Check } from 'lucide-react'

export default function TutorCategoriesPage() {
  const { data: profileData, isLoading: loadingProfile } =
    useGetMyTutorProfileQuery()
  const { data: categoriesData, isLoading: loadingCats } =
    useGetCategoriesQuery()

  const myProfile = profileData?.data ?? null

  const [selected, setSelected] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (myProfile) {
      setSelected(new Set(myProfile.categories.map((c) => c.id)))
    }
  }, [myProfile])

  const [updateCategories, { isLoading: isSaving }] =
    useUpdateTutorCategoriesMutation()

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSave = async () => {
    try {
      await updateCategories({ categoryIds: Array.from(selected) }).unwrap()
      toast.success('Subjects updated!')
    } catch {
      toast.error('Could not update subjects.')
    }
  }

  if (loadingProfile || loadingCats) return <LoadingSpinner fullPage />

  const categories = categoriesData?.data ?? []

  return (
    <div>
      <h1 className='mb-6 text-2xl font-bold text-slate-900'>My Subjects</h1>

      <Card className='max-w-2xl'>
        <CardHeader className='px-4 sm:px-6'>
          <div className='flex items-start gap-3'>
            <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600'>
              <BookOpen size={16} />
            </span>
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                <p className='text-sm font-semibold text-slate-900'>
                  Select the subjects you teach
                </p>
                <Badge variant='info'>{selected.size} selected</Badge>
              </div>
              <p className='mt-0.5 text-xs text-slate-400'>
                Tap a subject to select or deselect it
              </p>
            </div>
          </div>
        </CardHeader>
        <CardBody className='px-4 sm:px-6'>
          <div className='flex flex-wrap gap-2'>
            {categories.map((cat) => {
              const isSelected = selected.has(cat.id)
              return (
                <button
                  key={cat.id}
                  type='button'
                  onClick={() => toggle(cat.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}>
                  {isSelected && (
                    <Check
                      size={13}
                      strokeWidth={2.5}
                    />
                  )}
                  {cat.name}
                </button>
              )
            })}
          </div>

          <div className='mt-6 flex justify-end border-t border-slate-100 pt-4'>
            <Button
              onClick={handleSave}
              loading={isSaving}>
              Save Subjects
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
