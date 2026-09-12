import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  TrendingUp,
  Package,
  BarChart3,
  ShoppingCart,
  Wallet,
  Activity,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Lightbulb,
  RefreshCcw,
} from 'lucide-react'

const PYTHON_API = 'https://pospython-service.vercel.app'

export default function Analytics() {
  const [daily, setDaily] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios
        .get(`${PYTHON_API}/reports/daily-summary`)
        .catch(() => null),

      axios
        .get(`${PYTHON_API}/reports/inventory-health`)
        .catch(() => null),
    ])
      .then(([d, i]) => {
        if (d) setDaily(d.data.data)
        if (i) setInventory(i.data.data)

        if (!d && !i) {
          toast.error('Python service offline (port 8001)')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">

        <div className="flex flex-col items-center">

          <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
            <RefreshCcw
              size={23}
              className="text-emerald-600 animate-spin"
            />
          </div>

          <p className="font-semibold text-slate-700">
            Loading analytics...
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Fetching business insights
          </p>

        </div>

      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-200">
            <BarChart3
              className="text-white"
              size={22}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Analytics
            </h1>

            <p className="text-sm text-slate-500 mt-0.5">
              Business insights and inventory intelligence
            </p>
          </div>

        </div>

        <div className="inline-flex items-center gap-2 self-start lg:self-auto px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">

          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

          <span className="text-sm font-medium text-slate-600">
            Powered by Python FastAPI
          </span>

        </div>

      </div>

      {/* ================= OFFLINE ================= */}
      {!daily && !inventory && (

        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">

          <div className="absolute right-0 top-0 w-32 h-32 bg-amber-200/20 rounded-full blur-2xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">

            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle
                className="text-amber-600"
                size={23}
              />
            </div>

            <div>
              <p className="font-bold text-amber-900">
                Python service is offline
              </p>

              <p className="text-sm text-amber-700 mt-1">
                Start the FastAPI service to load analytics and
                inventory reports.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 bg-white/70 border border-amber-200 rounded-lg px-3 py-2">

                <code className="text-xs text-amber-800">
                  cd python-service && uvicorn main:app --reload --port 8001
                </code>

              </div>
            </div>

          </div>

        </div>

      )}

      {/* ================= DAILY SUMMARY ================= */}
      {daily && (

        <section className="space-y-4">

          {/* Section Header */}
          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp
                    size={17}
                    className="text-emerald-600"
                  />
                </div>

                <h2 className="font-bold text-slate-900">
                  Daily Summary
                </h2>

              </div>

              <p className="text-xs text-slate-500 mt-1 ml-10">
                Today's sales performance
              </p>
            </div>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
              <Activity size={13} />
              Live Data
            </span>

          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Revenue */}
            <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Revenue
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    Rs {daily.total_revenue?.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-semibold">
                    <ArrowUpRight size={13} />
                    Today's revenue
                  </div>
                </div>

                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Wallet
                    size={21}
                    className="text-emerald-600"
                  />
                </div>

              </div>

            </div>

            {/* Sales */}
            <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Sales Count
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {daily.total_sales}
                  </p>

                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-semibold">
                    <ShoppingCart size={13} />
                    Transactions today
                  </div>
                </div>

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ShoppingCart
                    size={21}
                    className="text-blue-600"
                  />
                </div>

              </div>

            </div>

            {/* Avg Ticket */}
            <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Average Ticket
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    Rs {daily.average_ticket?.toLocaleString()}
                  </p>

                  <div className="flex items-center gap-1 mt-2 text-xs text-violet-600 font-semibold">
                    <TrendingUp size={13} />
                    Average order value
                  </div>
                </div>

                <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
                  <BarChart3
                    size={21}
                    className="text-violet-600"
                  />
                </div>

              </div>

            </div>

          </div>

          {/* Top Selling */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

              <div>
                <h3 className="font-bold text-slate-900">
                  Top Selling Products
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Best performing products today
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Package
                  size={17}
                  className="text-emerald-600"
                />
              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {daily.top_selling?.length > 0 ? (

                daily.top_selling.map((p, i) => (

                  <div
                    key={i}
                    className="flex items-center justify-between px-5 py-4 hover:bg-emerald-50/30 transition-colors"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        #{i + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-sm text-slate-800">
                          {p.name}
                        </p>

                        <p className="text-xs text-slate-400 mt-0.5">
                          {p.qty} units sold
                        </p>
                      </div>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-sm text-emerald-700">
                        Rs {p.revenue?.toLocaleString()}
                      </p>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Revenue
                      </p>

                    </div>

                  </div>

                ))

              ) : (

                <div className="py-10 text-center text-sm text-slate-400">
                  No top-selling data available
                </div>

              )}

            </div>

          </div>

        </section>

      )}

      {/* ================= INVENTORY HEALTH ================= */}
      {inventory && (

        <section className="space-y-4">

          {/* Section Header */}
          <div className="flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">

                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Package
                    size={17}
                    className="text-blue-600"
                  />
                </div>

                <h2 className="font-bold text-slate-900">
                  Inventory Health
                </h2>

              </div>

              <p className="text-xs text-slate-500 mt-1 ml-10">
                Inventory performance and stock condition
              </p>
            </div>

          </div>

          {/* Inventory KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Products */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <Package
                  size={19}
                  className="text-slate-600"
                />
              </div>

              <p className="text-2xl font-bold text-slate-900">
                {inventory.total_products}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Total Products
              </p>

            </div>

            {/* Low Stock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle
                  size={19}
                  className="text-red-600"
                />
              </div>

              <p className="text-2xl font-bold text-red-600">
                {inventory.low_stock_count}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Low Stock
              </p>

            </div>

            {/* Health */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle2
                  size={19}
                  className="text-emerald-600"
                />
              </div>

              <p className="text-2xl font-bold text-emerald-600">
                {inventory.health_score}%
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Inventory Health
              </p>

            </div>

            {/* Value */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Wallet
                  size={19}
                  className="text-blue-600"
                />
              </div>

              <p className="text-2xl font-bold text-blue-600">
                Rs {(inventory.inventory_value / 1000).toFixed(0)}k
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Inventory Value
              </p>

            </div>

          </div>

          {/* Health Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

            <div className="flex items-center justify-between mb-3">

              <div>
                <p className="font-semibold text-slate-800">
                  Inventory Health Score
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Overall stock availability
                </p>
              </div>

              <span className="text-lg font-bold text-emerald-600">
                {inventory.health_score}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(inventory.health_score || 0, 0),
                    100
                  )}%`,
                }}
              />

            </div>

          </div>

          {/* Alerts */}
          {inventory.alerts?.length > 0 && (

            <div className="bg-white border border-red-100 rounded-2xl shadow-sm overflow-hidden">

              <div className="px-5 py-4 bg-red-50/60 border-b border-red-100 flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle
                    size={17}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-red-900">
                    Inventory Alerts
                  </h3>

                  <p className="text-xs text-red-600 mt-0.5">
                    Items that require attention
                  </p>
                </div>

              </div>

              <div className="p-5 space-y-2">

                {inventory.alerts.map((a, i) => (

                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-100"
                  >

                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />

                    <p className="text-sm text-red-700">
                      {a}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* Recommendations */}
          {inventory.recommendations?.length > 0 && (

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">

                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Lightbulb
                    size={17}
                    className="text-amber-600"
                  />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Recommendations
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Suggestions to improve inventory health
                  </p>
                </div>

              </div>

              <div className="p-5 space-y-3">

                {inventory.recommendations.map((r, i) => (

                  <div
                    key={i}
                    className="flex items-start gap-3"
                  >

                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">

                      <span className="text-xs font-bold text-emerald-600">
                        {i + 1}
                      </span>

                    </div>

                    <p className="text-sm text-slate-600 leading-6">
                      {r}
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

        </section>

      )}

    </div>
  )
}