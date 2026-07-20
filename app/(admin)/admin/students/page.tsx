'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore'
import type { JSX } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase/config'
import { UsersIcon, PenIcon, TrashIcon } from '@/components/icons'
import type { UserDoc } from '@/types'

type Student = Omit<UserDoc, 'createdAt'> & {
  createdAt: Timestamp | null
  photo?: string | null
}

function SearchIcon(): JSX.Element {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='11' cy='11' r='8' />
      <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
  )
}

interface DeleteModalProps {
  student: Student
  onConfirm: () => void
  onCancel: () => void
  deleting: boolean
}

function DeleteModal({
  student,
  onConfirm,
  onCancel,
  deleting,
}: DeleteModalProps): JSX.Element {
  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-40 bg-ink-900/40 backdrop-blur-sm'
        onClick={onCancel}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
        <div
          className='bg-white border border-ink-100 shadow-[0_8px_32px_rgba(45,26,26,0.18)]
                     w-full max-w-sm p-6 space-y-4 animate-scale-in'
        >
          {/* Icon */}
          <div className='w-12 h-12 rounded-full bg-error-50 flex items-center justify-center mx-auto'>
            <TrashIcon size={22} className='text-error-400' />
          </div>

          {/* Text */}
          <div className='text-center space-y-1'>
            <h3 className='font-serif text-lg text-ink-900'>Delete student?</h3>
            <p className='text-sm text-ink-400'>
              <span className='font-medium text-ink-700'>
                {student.name || 'This user'}
              </span>{' '}
              will be permanently removed from Firestore. This cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className='flex gap-3 pt-1'>
            <button
              type='button'
              onClick={onCancel}
              disabled={deleting}
              className='btn btn-ghost flex-1'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={onConfirm}
              disabled={deleting}
              className='flex-1 py-2.5 px-4 rounded-full text-sm font-semibold
                         bg-error-500 text-white hover:bg-error-600
                         transition-all duration-200 disabled:opacity-50
                         flex items-center justify-center gap-2'
            >
              {deleting ? (
                <svg
                  className='animate-spin'
                  width='15'
                  height='15'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                </svg>
              ) : (
                <TrashIcon size={14} />
              )}
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default function StudentsPage(): JSX.Element {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [filtered, setFiltered] = useState<Student[]>([])
  const [search, setSearch] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)
  const [deleting, setDeleting] = useState<boolean>(false)

  useEffect(() => {
    async function fetchStudents(): Promise<void> {
      try {
        const snap = await getDocs(
          query(collection(db, 'users'), orderBy('createdAt', 'desc')),
        )
        const data = snap.docs.map((d) => ({
          uid: d.id,
          ...d.data(),
        })) as Student[]
        setStudents(data)
        setFiltered(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      students.filter(
        (s) =>
          s.name?.toLowerCase().includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.phone?.includes(q),
      ),
    )
  }, [search, students])

  async function toggleRole(uid: string, currentRole: string): Promise<void> {
    const newRole: 'admin' | 'student' =
      currentRole === 'admin' ? 'student' : 'admin'
    setUpdatingRole(uid)
    try {
      await updateDoc(doc(db, 'users', uid), { role: newRole })
      setStudents((prev) =>
        prev.map((s) => (s.uid === uid ? { ...s, role: newRole } : s)),
      )
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingRole(null)
    }
  }

  async function handleDelete(): Promise<void> {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteDoc(doc(db, 'users', deleteTarget.uid))
      setStudents((prev) => prev.filter((s) => s.uid !== deleteTarget.uid))
      setDeleteTarget(null)
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className='space-y-4 animate-pulse'>
        <div className='skeleton h-8 w-40' />
        <div className='skeleton h-12 w-full' />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className='skeleton h-16' />
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          student={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      <div className='space-y-6 animate-fade-up'>
        <div className='page-header'>
          <p className='page-eyebrow'>Admin · Users</p>
          <h1 className='page-title'>Students</h1>
          <p className='page-desc'>{students.length} registered users</p>
        </div>

        {/* Search */}
        <div className='relative max-w-sm'>
          <div
            className='pointer-events-none absolute left-0 top-0 h-full w-10
                          flex items-center justify-center text-ink-300'
          >
            <SearchIcon />
          </div>
          <input
            className='input pl-11'
            placeholder='Search by name, email or phone…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div
          className='card p-0 overflow-hidden'
        >
          {filtered.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 gap-3'>
              <UsersIcon size={36} className='text-ink-200' />
              <p className='text-sm text-ink-300'>No users found</p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-ink-100 bg-pink-50/60'>
                    {[
                      { label: 'User', className: '' },
                      { label: 'Phone', className: 'hidden md:table-cell' },
                      { label: 'Enrolled', className: 'hidden lg:table-cell' },
                      { label: 'Role', className: '' },
                      { label: 'Joined', className: 'hidden lg:table-cell' },
                      { label: 'Actions', className: '' },
                    ].map(({ label, className }) => (
                      <th
                        key={label}
                        className={`text-left px-5 py-3.5 text-[10px] font-semibold
                                    uppercase tracking-widest text-ink-400 ${className}`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-ink-100'>
                  {filtered.map((student) => (
                    <tr
                      key={student.uid}
                      className='hover:bg-pink-50/40 transition-colors duration-150'
                    >
                      {/* User */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-3'>
                          <div
                            className='w-9 h-9 rounded-full bg-pink-100 flex items-center
                                          justify-center flex-shrink-0 overflow-hidden'
                          >
                            {student.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={student.photo}
                                alt=''
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <span className='text-xs font-semibold text-pink-500'>
                                {student.name?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className='font-medium text-ink-900'>
                              {student.name || 'Unnamed'}
                            </p>
                            <p className='text-xs text-ink-400'>
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className='px-5 py-4 text-ink-500 hidden md:table-cell'>
                        {student.phone || '—'}
                      </td>

                      {/* Enrolled */}
                      <td className='px-5 py-4 hidden lg:table-cell'>
                        <span className='badge badge-rose'>
                          {student.enrolledPrograms?.length || 0} programs
                        </span>
                      </td>

                      {/* Role toggle */}
                      <td className='px-5 py-4'>
                        <button
                          type='button'
                          onClick={() => toggleRole(student.uid, student.role)}
                          disabled={updatingRole === student.uid}
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full
                                      border transition-all duration-150 disabled:opacity-50
                                      ${
                                        student.role === 'admin'
                                          ? 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
                                          : 'bg-pink-50 text-pink-500 border-pink-200 hover:bg-pink-100'
                                      }`}
                        >
                          {updatingRole === student.uid ? '…' : student.role}
                        </button>
                      </td>

                      {/* Joined */}
                      <td className='px-5 py-4 text-xs text-ink-400 hidden lg:table-cell'>
                        {student.createdAt
                          ?.toDate?.()
                          ?.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }) || '—'}
                      </td>

                      {/* Actions */}
                      <td className='px-5 py-4'>
                        <div className='flex items-center gap-2'>
                          <button
                            type='button'
                            onClick={() =>
                              router.push(`/admin/students/${student.uid}`)
                            }
                            title='Edit student'
                            className='w-8 h-8 rounded-sm flex items-center justify-center
                                       text-ink-400 hover:text-pink-500 hover:bg-pink-50
                                       transition-all duration-150'
                          >
                            <PenIcon size={14} />
                          </button>
                          <button
                            type='button'
                            onClick={() => setDeleteTarget(student)}
                            title='Delete student'
                            className='w-8 h-8 rounded-sm flex items-center justify-center
                                       text-ink-400 hover:text-error-500 hover:bg-error-50
                                       transition-all duration-150'
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
