import { cn } from '@/lib/cn'

/** The primary action of a form. Gold like the site's primary CTA. */
export function TxButton({ label, pending, disabled, onClick }: { label: string; pending: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      className={cn(
        'cta-primary inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium text-background transition-all duration-200',
        'hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100',
      )}
    >
      {pending ? (
        <>
          <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-background/30 border-t-background" />
          Confirming…
        </>
      ) : (
        label
      )}
    </button>
  )
}
