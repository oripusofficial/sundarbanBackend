import {
  Bell,
  BookOpen,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Home,
  Images,
  LogOut,
  Map,
  Menu,
  Package,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

import useAuth from '../hooks/useAuth'

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: Images, label: 'Gallery', path: '/gallery' },
  { icon: BookOpen, label: 'Docs', path: '/docs' },
  { icon: CalendarCheck, label: 'Bookings', path: '/bookings' },
  { icon: Package, label: 'Packages', path: '/packages' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const { logout, user } = useAuth()

  const sidebarWidth = isCollapsed ? 'lg:w-20' : 'lg:w-72'
  const mainOffset = isCollapsed ? 'lg:pl-20' : 'lg:pl-72'

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      {isMobileOpen && (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          type="button"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-slate-950 px-3 py-4 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0 ${sidebarWidth} ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500 text-sm font-black text-slate-950">
              SA
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Sundarban Admin</div>
                <div className="truncate text-xs text-slate-400">Operations Suite</div>
              </div>
            )}
          </div>

          <button
            aria-label="Close sidebar"
            className="grid h-9 w-9 place-items-center rounded-md text-slate-300 hover:bg-white/10 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                className={({ isActive }) =>
                  `group flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/20'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`
                }
                end={item.path === '/'}
                key={item.label}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : undefined}
                to={item.path}
              >
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="space-y-3 border-t border-white/10 px-2 pt-4">
          {!isCollapsed && (
            <div className="rounded-lg bg-white/5 p-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Map aria-hidden="true" className="h-4 w-4 text-emerald-400" />
                Tour Season
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Peak booking window is active. Keep gallery and packages fresh.
              </p>
            </div>
          )}

          <button
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden h-10 w-full items-center justify-center gap-2 rounded-lg bg-white/5 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white lg:flex"
            onClick={() => setIsCollapsed((current) => !current)}
            type="button"
          >
            {isCollapsed ? (
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                Collapse
              </>
            )}
          </button>
        </div>
      </aside>

      <div className={`min-h-screen transition-all duration-300 ${mainOffset}`}>
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                aria-label="Open sidebar"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                onClick={() => setIsMobileOpen(true)}
                type="button"
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </button>

              <label className="relative hidden min-w-[280px] sm:block">
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  placeholder="Search bookings, tours, docs"
                  type="search"
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                type="button"
              >
                <Bell aria-hidden="true" className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
              </button>
              <div className="hidden items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm sm:flex">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-950 text-xs font-bold text-white">
                  {(user?.name || 'Admin')
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    {user?.name || 'Admin'}
                  </div>
                  <div className="text-xs text-slate-500">{user?.role || 'Manager'}</div>
                </div>
              </div>
              <button
                aria-label="Logout"
                className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
                onClick={logout}
                type="button"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
