'use client'

import { useState } from 'react'
import {
  useGetAllCategoriesAdminQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation
} from '@/lib/redux/api/categoryApi'
import type { Category } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { cn, slugify } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Tag } from 'lucide-react'

const PALETTE = [
  { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  { bg: 'bg-amber-100', text: 'text-amber-600' },
  { bg: 'bg-rose-100', text: 'text-rose-600' },
  { bg: 'bg-sky-100', text: 'text-sky-600' },
  { bg: 'bg-teal-100', text: 'text-teal-600' },
  { bg: 'bg-orange-100', text: 'text-orange-600' }
]

function ToggleSwitch({
  checked,
  onChange,
  title
}: {
  checked: boolean
  onChange: () => void
  title: string
}) {
  return (
    <button
      role='switch'
      aria-checked={checked}
      onClick={onChange}
      title={title}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2',
        checked ? 'bg-indigo-600' : 'bg-slate-300'
      )}>
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  )
}

export default function AdminCategoriesPage() {
  const { data, isLoading } = useGetAllCategoriesAdminQuery()
  const categories = data?.data ?? []

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [editTarget, setEditTarget] = useState<Category | null>(null)
  const [editName, setEditName] = useState('')

  const activeCount = categories.filter((c) => c.isActive).length
  const inactiveCount = categories.length - activeCount

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await createCategory({
        name: newName.trim(),
        slug: slugify(newName.trim())
      }).unwrap()
      toast.success('Category created!')
      setNewName('')
      setCreateOpen(false)
    } catch {
      toast.error('Could not create category.')
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editTarget || !editName.trim()) return
    try {
      await updateCategory({
        id: editTarget.id,
        name: editName.trim(),
        slug: slugify(editName.trim())
      }).unwrap()
      toast.success('Category updated!')
      setEditTarget(null)
    } catch {
      toast.error('Could not update category.')
    }
  }

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return
    try {
      await deleteCategory(cat.id).unwrap()
      toast.success('Category deleted.')
    } catch {
      toast.error('Could not delete category.')
    }
  }

  const handleToggleActive = async (cat: Category) => {
    try {
      await updateCategory({ id: cat.id, isActive: !cat.isActive }).unwrap()
      toast.success(
        cat.isActive ? 'Category deactivated.' : 'Category activated.'
      )
    } catch {
      toast.error('Could not update category.')
    }
  }

  if (isLoading) return <LoadingSpinner fullPage />

  return (
    <div className='flex flex-col gap-6'>
      {/* Page Header */}
      <div className='rounded-2xl bg-linear-to-r from-indigo-600 to-indigo-500 p-6 text-white'>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold'>Category Management</h1>
            <p className='mt-1 text-sm text-indigo-100'>
              Control which subjects are available to tutors and students
            </p>
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              <span className='rounded-lg bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm'>
                {categories.length} Total
              </span>
              <span className='rounded-lg bg-emerald-400/30 px-3 py-1 text-sm font-medium'>
                {activeCount} Active
              </span>
              {inactiveCount > 0 && (
                <span className='rounded-lg bg-white/10 px-3 py-1 text-sm font-medium'>
                  {inactiveCount} Inactive
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={() => setCreateOpen(true)}
            className='shrink-0 gap-2 bg-white text-indigo-600 shadow-sm hover:bg-indigo-50'>
            <Plus size={16} />
            New Category
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center'>
          <div className='mb-4 rounded-full bg-indigo-50 p-4'>
            <Tag
              size={28}
              className='text-indigo-400'
            />
          </div>
          <p className='text-lg font-semibold text-slate-700'>
            No categories yet
          </p>
          <p className='mt-1 text-sm text-slate-400'>
            Create your first category to get started
          </p>
          <Button
            onClick={() => setCreateOpen(true)}
            className='mt-5 gap-2'>
            <Plus size={16} />
            New Category
          </Button>
        </div>
      )}

      {/* Category Grid */}
      {categories.length > 0 && (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {categories.map((cat, i) => {
            const color = PALETTE[i % PALETTE.length]
            return (
              <div
                key={cat.id}
                className={cn(
                  'relative flex flex-col rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md',
                  cat.isActive
                    ? 'border-slate-200'
                    : 'border-slate-200 opacity-60'
                )}>
                {/* Status badge — top-right corner */}
                <span
                  className={cn(
                    'absolute right-0 top-0 rounded-bl-lg rounded-tr-lg px-2.5 py-1 text-xs font-semibold overflow-hidden text-white',
                    cat.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                  )}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>

                {/* Card Body */}
                <div className='flex items-start gap-4 p-5'>
                  <div className={cn('shrink-0 rounded-xl p-3', color.bg)}>
                    <Tag
                      size={20}
                      className={color.text}
                    />
                  </div>
                  <div className='min-w-0 flex-1 pr-16'>
                    <p className='truncate font-semibold text-slate-900'>
                      {cat.name}
                    </p>
                    <p className='mt-0.5 truncate font-mono text-xs text-slate-400'>
                      /{cat.slug}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className='flex items-center justify-between rounded-b-xl border-t border-slate-100 bg-slate-50/70 px-5 py-3'>
                  <div className='flex items-center gap-2'>
                    <ToggleSwitch
                      checked={cat.isActive}
                      onChange={() => handleToggleActive(cat)}
                      title={
                        cat.isActive
                          ? 'Deactivate category'
                          : 'Activate category'
                      }
                    />
                    <span className='text-xs text-slate-500'>
                      {cat.isActive ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <Button
                      onClick={() => {
                        setEditTarget(cat)
                        setEditName(cat.name)
                      }}
                      variant='ghost'
                      size='sm'
                      className='rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600'
                      title='Edit category'>
                      <Pencil size={15} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(cat)}
                      className='rounded-lg p-1.5 transition-colors bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700'
                      title='Delete category'>
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title='New Category'>
        <form
          onSubmit={handleCreate}
          className='flex flex-col gap-4'>
          <Input
            id='new-name'
            label='Category Name'
            placeholder='e.g. Mathematics'
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          {newName && (
            <p className='text-xs text-slate-400'>
              Slug: <span className='font-mono'>{slugify(newName)}</span>
            </p>
          )}
          <div className='flex justify-end gap-3'>
            <Button
              variant='secondary'
              onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              type='submit'
              loading={isCreating}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title='Edit Category'>
        <form
          onSubmit={handleEdit}
          className='flex flex-col gap-4'>
          <Input
            id='edit-name'
            label='Category Name'
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
          />
          {editName && (
            <p className='text-xs text-slate-400'>
              Slug: <span className='font-mono'>{slugify(editName)}</span>
            </p>
          )}
          <div className='flex justify-end gap-3'>
            <Button
              variant='secondary'
              onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button
              type='submit'
              loading={isUpdating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
