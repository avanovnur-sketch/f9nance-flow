import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

export function LoadingState({ fullScreen = false, label = 'Загрузка…' }: { fullScreen?: boolean; label?: string }) {
  return (
    <div
      role="status"
      className={cn('flex flex-col items-center justify-center gap-4 text-muted', fullScreen ? 'min-h-screen' : 'py-16')}
    >
      <div className="relative">
        <div className="size-12 rounded-2xl bg-gradient-to-br from-accent-strong to-indigo-500 flex items-center justify-center shadow-lg">
          <Loader2 className="size-6 animate-spin text-white" aria-hidden />
        </div>
        <div className="animate-pulse-ring absolute inset-0 rounded-2xl bg-accent/40" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}
