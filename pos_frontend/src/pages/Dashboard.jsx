
import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock3,
  BarChart3,
  Receipt,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-green-100 flex items-center justify-center">
            <span className="w-6 h-6 rounded-full border-2 border-green-600/30 border-t-green-600 animate-spin" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={24} />
          </div>

          <h3 className="mt-4 font-bold text-slate-800">
            Unable to load dashboard
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Please try again later.
          </p>
        </div>
      </div>
    )
  }

  const cards = [
    {
      label: "Today's Sales",
      value: stats.overview.todaySales,
      icon: ShoppingCart,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      accent: 'from-blue-500 to-cyan-500',
    },
    {
      label: "Today's Revenue",
      value: `Rs ${stats.overview.todayRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      accent: 'from-green-500 to-emerald-500',
    },
    {
      label: 'Products',
      value: stats.overview.totalProducts,
      icon: Package,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      accent: 'from-violet-500 to-purple-500',
    },
    {
      label: 'Low Stock',
      value: stats.overview.lowStock,
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      accent: 'from-red-500 to-orange-500',
    },
    {
      label: 'Customers',
      value: stats.overview.totalCustomers,
      icon: Users,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      accent: 'from-orange-500 to-amber-500',
    },
  ]

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-green-950 to-emerald-950 p-6 lg:p-7 text-white shadow-xl">

        {/* Background Effects */}
        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-green-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-green-300">
                POS Overview
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="text-sm text-slate-300 mt-1">
              Monitor your sales, inventory and customers at a glance.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm">
            <TrendingUp size={17} className="text-green-400" />
            <span className="text-sm font-medium">
              Business Overview
            </span>
          </div>

        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        {cards.map((c) => {
          const Icon = c.icon

          return (
            <div
              key={c.label}
              className="
                group relative overflow-hidden
                bg-white rounded-2xl
                border border-slate-200/80
                p-5
                shadow-sm
                hover:shadow-xl hover:-translate-y-1
                transition-all duration-300
              "
            >

              {/* Accent */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.accent}`}
              />

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {c.label}
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-2 truncate">
                    {c.value}
                  </p>
                </div>

                <div
                  className={`
                    shrink-0 w-11 h-11 rounded-xl
                    ${c.iconBg}
                    flex items-center justify-center
                    ${c.iconColor}
                    group-hover:scale-110
                    transition-transform duration-300
                  `}
                >
                  <Icon size={20} />
                </div>

              </div>

              <div className="flex items-center gap-1 mt-4">
                <ArrowUpRight size={13} className={c.iconColor} />
                <span className="text-[11px] text-slate-400">
                  Current overview
                </span>
              </div>

            </div>
          )
        })}

      </div>

      {/* ================= CHART + RECENT SALES ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Sales Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <BarChart3 size={19} className="text-green-600" />
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  Last 7 Days Sales
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Daily sales performance
                </p>
              </div>

            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold text-green-700">
                SALES
              </span>
            </div>

          </div>

          <div className="p-6">

            {stats.dailySales.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={stats.dailySales}
                  margin={{
                    top: 10,
                    right: 5,
                    left: -15,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#e2e8f0"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="_id"
                    tick={{
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: '#64748b',
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{
                      fill: 'rgba(22, 163, 74, 0.05)',
                    }}
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.10)',
                      fontSize: '12px',
                    }}
                  />

                  <Bar
                    dataKey="total"
                    fill="#16a34a"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <BarChart3 size={24} className="text-slate-300" />
                </div>

                <p className="text-sm font-medium text-slate-500 mt-4">
                  No sales data yet
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Sales activity will appear here
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Receipt size={19} className="text-blue-600" />
              </div>

              <div>
                <h3 className="font-bold text-slate-800">
                  Recent Sales
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Latest transactions
                </p>
              </div>

            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock3 size={14} />
              Recent
            </div>

          </div>

          <div className="p-4">

            {stats.recentSales.length === 0 ? (
              <div className="h-[260px] flex flex-col items-center justify-center">

                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <Receipt size={24} className="text-slate-300" />
                </div>

                <p className="text-sm font-medium text-slate-500 mt-4">
                  No sales yet
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Recent transactions will appear here
                </p>

              </div>
            ) : (
              <div className="space-y-2">

                {stats.recentSales.map((s) => (
                  <div
                    key={s._id}
                    className="
                      group flex items-center justify-between gap-4
                      p-3.5 rounded-xl
                      border border-transparent
                      hover:border-slate-200
                      hover:bg-slate-50
                      transition-all duration-200
                    "
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center transition">
                        <Receipt
                          size={17}
                          className="text-slate-500"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-800 truncate">
                          {s.invoiceNumber}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-slate-400 truncate">
                            {s.cashier?.name || 'Unknown cashier'}
                          </p>

                          <span className="w-1 h-1 rounded-full bg-slate-300" />

                          <p className="text-xs text-slate-400">
                            {new Date(s.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>

                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-green-700 text-sm">
                        Rs {s.totalAmount?.toLocaleString()}
                      </p>

                      <p className="text-[10px] text-slate-400 mt-1">
                        Completed
                      </p>
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

