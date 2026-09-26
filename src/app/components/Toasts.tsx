import { AnimatePresence, motion } from 'motion/react'
import { createContext, use, useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Toast = { id: number; title: string; body?: string; tone: 'success' | 'error' | 'info' }
type Ctx = { push: (t: Omit<Toast, 'id'>) => void }

const ToastContext = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const next = useRef(0)

  const push = useCallback((t: Omit<Toast, 'id'>) => {
    next.current += 1
    const id = next.current
    setToasts((list) => [...list, { ...t, id }].slice(-3))
    setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 4200)
  }, [])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex gap-3 rounded-xl border border-foreground/10 bg-surface/95 p-4 shadow-xl shadow-black/40 backdrop-blur-xl"
            >
              <span
                aria-hidden="true"
                className={cn('mt-1 h-2 w-2 flex-shrink-0 rounded-full', t.tone === 'success' ? 'bg-brand-bright' : t.tone === 'info' ? 'bg-ink-blue' : 'bg-ink-rose')}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium">{t.title}</p>
                {t.body ? <p className="mt-0.5 text-xs break-words text-foreground/50">{t.body}</p> : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext>
  )
}

export function useToast() {
  const ctx = use(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}
