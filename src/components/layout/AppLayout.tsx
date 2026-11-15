import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileNavigation } from './MobileNavigation'

export function AppLayout() {
  return (
    <div className="min-h-screen md:flex">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded-lg focus:bg-accent-strong focus:px-4 focus:py-2 focus:text-white"
      >
        Перейти к содержимому
      </a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-10">
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  )
}
