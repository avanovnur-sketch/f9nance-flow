import { cn } from '../../utils/cn'

/** Серая заглушка пока грузятся данные */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-border/60', className)}
      aria-hidden="true"
    />
  )
}

/** Скелетон карточки дашборда */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-28" />
    </div>
  )
}

/** Скелетон строки таблицы транзакций */
export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="size-9 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

/** Скелетон дашборда — 4 карточки + 2 блока */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 xl:col-span-2">
          <Skeleton className="mb-4 h-5 w-40" />
          <Skeleton className="h-56 w-full" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <Skeleton className="mb-4 h-5 w-32" />
          <Skeleton className="h-56 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}
