import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { navItems } from './navItems'
import { LogoMark } from './Logo'

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-card/80 glass px-3 py-5 md:flex md:w-[76px] xl:w-64 xl:px-4">
      <div className="flex items-center gap-3 px-1">
        <LogoMark />
        <div className="hidden min-w-0 xl:block animate-fade-up">
          <p className="font-semibold leading-tight">FinanceFlow</p>
          <p className="text-xs text-muted">Personal finance manager</p>
        </div>
      </div>

      <nav aria-label="Основная навигация" className="mt-8 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }, i) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            aria-label={label}
            style={{ animationDelay: `${i * 0.05}s` }}
            className={({ isActive }) =>
              cn(
                'animate-fade-up flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-200 md:justify-center xl:justify-start',
                isActive
                  ? 'bg-gradient-to-r from-accent-strong to-indigo-500 text-white shadow-md shadow-accent/30'
                  : 'text-muted hover:bg-card-hover hover:text-fg hover:translate-x-0.5',
              )
            }
          >
            <Icon className="size-5 shrink-0" aria-hidden />
            <span className="hidden xl:inline">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
