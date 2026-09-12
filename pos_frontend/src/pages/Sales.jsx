import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Receipt,
  RefreshCcw,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  XCircle,
  Clock3,
  RotateCcw,
  Search,
} from 'lucide-react'

export default function Sales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/sales')
      .then(res => setSales(res.data.data))
      .catch(() => toast.error('Failed to load sales'))
      .finally(() => setLoading(false))
  }, [])

  const handleRefund = async (id) => {
    if (!confirm('Refund this sale? Stock will be restored.')) return

    try {
      await api.post(`/sales/${id}/refund`)
      toast.success('Refunded')

      const { data } = await api.get('/sales')
      setSales(data.data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Refund failed')
    }
  }

  const completedSales = sales.filter(
    s => s.status === 'completed'
  ).length

  const refundedSales = sales.filter(
    s => s.status === 'refunded'
  ).length

  const totalRevenue = sales
    .filter(s => s.status === 'completed')
    .reduce(
      (sum, s) => sum + Number(s.totalAmount || 0),
      0
    )

  const getPaymentIcon = (method) => {
    if (method === 'card') return CreditCard
    if (method === 'mobile') return Smartphone
    return Banknote
  }

  const getPaymentStyle = (method) => {
    if (method === 'card') {
      return 'bg-blue-50 text-blue-700 border-blue-100'
    }

    if (method === 'mobile') {
      return 'bg-violet-50 text-violet-700 border-violet-100'
    }

    return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-200">
            <Receipt className="text-white" size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Sales History
            </h1>

            <p className="text-sm text-slate-500 mt-0.5">
              Track transactions, payments and refunds
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-600">
            Sales system active
          </span>
        </div>

      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Revenue */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Revenue
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                Rs {totalRevenue.toLocaleString()}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Completed transactions
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Banknote className="text-emerald-600" size={21} />
            </div>

          </div>
        </div>

        {/* Completed */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Completed Sales
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {completedSales}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Successful transactions
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <CheckCircle2 className="text-blue-600" size={21} />
            </div>

          </div>
        </div>

        {/* Refunded */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Refunded Sales
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {refundedSales}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Stock restored
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <RotateCcw className="text-red-600" size={21} />
            </div>

          </div>
        </div>

      </div>

      {/* ================= TABLE CARD ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>
            <h2 className="font-bold text-slate-900">
              Transaction History
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              View all POS transactions and payment details
            </p>
          </div>

          <div className="flex items-center gap-2">

            <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
              {sales.length} Transactions
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live
            </div>

          </div>

        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Invoice
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Cashier
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Items
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Payment
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Date
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (

                <tr>
                  <td colSpan="8" className="py-16">

                    <div className="flex flex-col items-center justify-center">

                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                        <RefreshCcw
                          className="text-emerald-600 animate-spin"
                          size={21}
                        />
                      </div>

                      <p className="font-semibold text-slate-700">
                        Loading sales...
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Fetching transaction history
                      </p>

                    </div>

                  </td>
                </tr>

              ) : sales.length === 0 ? (

                <tr>
                  <td colSpan="8" className="py-16">

                    <div className="flex flex-col items-center justify-center">

                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <Receipt
                          className="text-slate-400"
                          size={25}
                        />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No sales yet
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Completed transactions will appear here
                      </p>

                    </div>

                  </td>
                </tr>

              ) : (

                sales.map(s => {

                  const PaymentIcon = getPaymentIcon(
                    s.paymentMethod
                  )

                  return (
                    <tr
                      key={s._id}
                      className="group hover:bg-emerald-50/30 transition-colors"
                    >

                      {/* Invoice */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                            <Receipt
                              size={16}
                              className="text-emerald-600"
                            />
                          </div>

                          <div>
                            <span className="font-mono text-xs font-bold text-slate-700">
                              {s.invoiceNumber}
                            </span>

                            <p className="text-[10px] text-slate-400 mt-0.5">
                              Invoice
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Cashier */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                            {(s.cashier?.name || '-')
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <span className="font-medium text-slate-700">
                            {s.cashier?.name || '-'}
                          </span>

                        </div>

                      </td>

                      {/* Items */}
                      <td className="px-5 py-4">

                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold">
                          <ShoppingCart size={13} />
                          {s.items?.length || 0}
                        </div>

                      </td>

                      {/* Total */}
                      <td className="px-5 py-4">

                        <span className="font-bold text-slate-800">
                          Rs {s.totalAmount?.toLocaleString()}
                        </span>

                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold capitalize ${getPaymentStyle(
                            s.paymentMethod
                          )}`}
                        >
                          <PaymentIcon size={13} />
                          {s.paymentMethod}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        {s.status === 'completed' ? (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold">
                            <CheckCircle2 size={13} />
                            Completed
                          </span>

                        ) : s.status === 'refunded' ? (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-100 text-xs font-bold">
                            <XCircle size={13} />
                            Refunded
                          </span>

                        ) : (

                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold">
                            <Clock3 size={13} />
                            {s.status}
                          </span>

                        )}

                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">

                        <div className="text-xs">

                          <p className="font-medium text-slate-600">
                            {new Date(
                              s.createdAt
                            ).toLocaleDateString()}
                          </p>

                          <p className="text-slate-400 mt-0.5">
                            {new Date(
                              s.createdAt
                            ).toLocaleTimeString()}
                          </p>

                        </div>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">

                        {s.status === 'completed' ? (

                          <button
                            onClick={() => handleRefund(s._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                          >
                            <RotateCcw size={14} />
                            Refund
                          </button>

                        ) : (

                          <span className="text-xs text-slate-300">
                            —
                          </span>

                        )}

                      </td>

                    </tr>
                  )
                })
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}