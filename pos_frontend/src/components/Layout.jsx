
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Store,
  ChevronRight,
  Circle
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pos', icon: ShoppingCart, label: 'POS Terminal' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/sales', icon: Receipt, label: 'Sales History' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">

      {/* =========================
          MOBILE OVERLAY
      ========================= */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[270px]
          bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
          text-white
          border-r border-white/10
          shadow-2xl
          transform transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static
          flex flex-col
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* =========================
            BRAND
        ========================= */}
        <div className="h-[76px] px-5 flex items-center justify-between border-b border-white/10">

          <div className="flex items-center gap-3">

            <div className="
              w-11 h-11 rounded-2xl
              bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-700
              flex items-center justify-center
              shadow-lg shadow-emerald-500/20
              ring-1 ring-white/10
            ">
              <Store size={22} className="text-white" />
            </div>

            <div>
              <h1 className="text-[17px] font-bold tracking-tight">
                POS System
              </h1>

              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="
                    animate-ping absolute inline-flex
                    h-full w-full rounded-full
                    bg-emerald-400 opacity-75
                  " />
                  <span className="
                    relative inline-flex rounded-full
                    h-2 w-2 bg-emerald-500
                  " />
                </span>

                <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Live System
                </span>
              </div>
            </div>

          </div>

          <button
            onClick={() => setOpen(false)}
            className="
              lg:hidden p-2 rounded-xl
              text-slate-400
              hover:text-white
              hover:bg-white/10
              transition
            "
          >
            <X size={19} />
          </button>

        </div>

        {/* =========================
            NAVIGATION
        ========================= */}
        <div className="flex-1 overflow-y-auto px-3 py-6">

          <p className="
            px-3 mb-3
            text-[10px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-slate-500
          ">
            Main Menu
          </p>

          <nav className="space-y-1.5">

            {navItems.map(({ to, icon: Icon, label }) => (

              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `
                    group relative flex items-center gap-3
                    px-3.5 py-3
                    rounded-xl
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? `
                          bg-gradient-to-r
                          from-emerald-500
                          to-green-600
                          text-white
                          shadow-lg
                          shadow-emerald-900/30
                        `
                        : `
                          text-slate-400
                          hover:text-white
                          hover:bg-white/[0.06]
                        `
                    }
                  `
                }
              >

                {({ isActive }) => (
                  <>
                    {/* Active indicator */}
                    {isActive && (
                      <span className="
                        absolute left-0 top-1/2
                        -translate-y-1/2
                        w-1 h-7
                        rounded-r-full
                        bg-white
                      " />
                    )}

                    <span
                      className={`
                        flex items-center justify-center
                        w-9 h-9 rounded-lg
                        transition
                        ${
                          isActive
                            ? 'bg-white/15'
                            : 'bg-white/[0.04] group-hover:bg-white/[0.08]'
                        }
                      `}
                    >
                      <Icon size={18} />
                    </span>

                    <span className="flex-1">
                      {label}
                    </span>

                    {isActive && (
                      <ChevronRight
                        size={16}
                        className="text-white/80"
                      />
                    )}
                  </>
                )}

              </NavLink>

            ))}

          </nav>

          {/* =========================
              QUICK STATUS
          ========================= */}
          <div className="
            mt-8 mx-1
            p-4
            rounded-2xl
            bg-gradient-to-br
            from-emerald-500/10
            to-green-500/5
            border border-emerald-500/10
          ">

            <div className="flex items-center gap-2 mb-2">

              <div className="
                w-7 h-7 rounded-lg
                bg-emerald-500/15
                flex items-center justify-center
              ">
                <Circle
                  size={10}
                  fill="currentColor"
                  className="text-emerald-400"
                />
              </div>

              <span className="text-xs font-semibold text-slate-200">
                System Online
              </span>

            </div>

            <p className="text-[11px] leading-relaxed text-slate-500">
              POS services are running normally and ready for transactions.
            </p>

          </div>

        </div>

        {/* =========================
            USER PROFILE
        ========================= */}
        <div className="
          p-3
          border-t border-white/10
          bg-black/10
        ">

          <div className="
            p-3
            rounded-2xl
            bg-white/[0.04]
            border border-white/[0.06]
          ">

            <div className="flex items-center gap-3">

              <div className="
                relative
                w-10 h-10
                rounded-xl
                bg-gradient-to-br
                from-emerald-400
                to-green-700
                flex items-center justify-center
                text-sm font-bold
                shadow-lg shadow-emerald-900/30
              ">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}

                <span className="
                  absolute
                  -right-0.5
                  -bottom-0.5
                  w-3 h-3
                  rounded-full
                  bg-emerald-400
                  border-2
                  border-slate-900
                " />
              </div>

              <div className="min-w-0 flex-1">

                <p className="
                  text-sm font-semibold
                  text-white truncate
                ">
                  {user?.name || 'User'}
                </p>

                <p className="
                  text-[11px]
                  text-slate-500
                  capitalize
                  truncate
                ">
                  {user?.role || 'User'}
                </p>

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="
                mt-3
                flex items-center justify-center gap-2
                w-full
                px-3 py-2.5
                rounded-xl
                text-xs font-medium
                text-slate-400
                bg-white/[0.03]
                border border-white/[0.05]
                hover:bg-red-500/10
                hover:text-red-400
                hover:border-red-500/10
                transition-all
              "
            >
              <LogOut size={15} />
              Sign Out
            </button>

          </div>

        </div>

      </aside>

      {/* =========================
          MAIN AREA
      ========================= */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">

        {/* =========================
            HEADER
        ========================= */}
        <header className="
          h-[76px]
          shrink-0
          bg-white
          border-b border-slate-200
          flex items-center
          px-4 lg:px-7
          shadow-sm
        ">

          <div className="flex items-center gap-4 w-full">

            {/* Mobile Menu */}
            <button
              className="
                lg:hidden
                w-10 h-10
                flex items-center justify-center
                rounded-xl
                bg-slate-100
                text-slate-600
                hover:bg-slate-200
                transition
              "
              onClick={() => setOpen(true)}
            >
              <Menu size={21} />
            </button>

            {/* Header Title */}
            <div className="flex-1">

              <div className="flex items-center gap-2">

                <h2 className="
                  text-base lg:text-lg
                  font-bold
                  text-slate-800
                  tracking-tight
                ">
                  Point of Sale Management
                </h2>

                <span className="
                  hidden sm:inline-flex
                  items-center gap-1.5
                  px-2.5 py-1
                  rounded-full
                  bg-emerald-50
                  border border-emerald-100
                  text-[10px]
                  font-semibold
                  text-emerald-600
                  uppercase
                  tracking-wide
                ">
                  <span className="
                    w-1.5 h-1.5
                    rounded-full
                    bg-emerald-500
                  " />
                  Online
                </span>

              </div>

              <p className="
                hidden sm:block
                text-xs
                text-slate-400
                mt-0.5
              ">
                Manage your store, sales and inventory
              </p>

            </div>

            {/* Right Header Status */}
            <div className="
              hidden md:flex
              items-center gap-3
            ">

              <div className="
                flex items-center gap-2
                px-3 py-2
                rounded-xl
                bg-slate-50
                border border-slate-100
              ">

                <div className="
                  w-7 h-7
                  rounded-lg
                  bg-emerald-100
                  flex items-center justify-center
                ">
                  <Store
                    size={14}
                    className="text-emerald-600"
                  />
                </div>

                <div>
                  <p className="
                    text-[10px]
                    text-slate-400
                    uppercase
                    tracking-wide
                  ">
                    Register
                  </p>

                  <p className="
                    text-xs
                    font-semibold
                    text-slate-700
                  ">
                    Main Counter
                  </p>
                </div>

              </div>

            </div>

          </div>

        </header>

        {/* =========================
            CONTENT
        ========================= */}
        <main className="
          flex-1
          overflow-y-auto
          bg-gradient-to-br
          from-slate-100
          via-slate-50
          to-emerald-50/30
          p-4
          lg:p-7
        ">

          <div className="max-w-[1800px] mx-auto">
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  )
}

