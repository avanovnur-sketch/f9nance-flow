import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

interface Props {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-10 text-center animate-fade-in">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-border to-card-hover text-muted">
        <Inbox className="size-7" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="font-semibold">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
