'use client'

import { useState } from 'react'

interface Module {
  weekNum: number
  title: string
  description: string
  locked: boolean
}

export default function CurriculumList({
  modules,
  isDark,
}: {
  modules: Module[]
  isDark: boolean
}) {
  const [openWeek, setOpenWeek] = useState<number | null>(null)

  return (
    <div className='space-y-3'>
      {modules.map((mod) => {
        const isOpen = openWeek === mod.weekNum

        return (
          <div
            key={mod.weekNum}
            onClick={() =>
              !mod.locked && setOpenWeek(isOpen ? null : mod.weekNum)
            }
            className={`relative rounded-xl border p-5 backdrop-blur-sm transition-all overflow-hidden ${
              isDark
                ? 'border-white/10 bg-white/[0.03]'
                : 'border-rose-100 bg-white/40'
            } ${!mod.locked ? 'cursor-pointer hover:border-rose-300' : 'cursor-default'}`}
          >
            <div
              className={
                mod.locked ? 'blur-sm select-none pointer-events-none' : ''
              }
            >
              <div className='flex items-center justify-between mb-1.5'>
                {mod.weekNum && (
                  <span
                    className={`text-xs font-semibold uppercase tracking-widest ${
                      isDark ? 'text-[var(--pink-200)]' : 'text-rose-400'
                    }`}
                  >
                    Week {mod.weekNum}
                  </span>
                )}
              </div>
              <h3
                className={`font-serif text-lg mb-1.5 ${
                  isDark ? 'text-white' : 'text-ink-900'
                }`}
              >
                {mod.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-white/60' : 'text-ink-500'
                } ${!mod.locked && !isOpen ? 'line-clamp-2' : ''}`}
              >
                {mod.description}
              </p>
            </div>

            {mod.locked && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                    isDark
                      ? 'bg-black/40 text-white/70'
                      : 'bg-white/70 text-ink-500'
                  }`}
                >
                  🔒 Unlocks after enrollment
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
