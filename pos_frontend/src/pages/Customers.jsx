import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Users,
  UserPlus,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  Wallet,
  X,
  Save,
  UserRound,
} from 'lucide-react'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  })

  const fetchData = () => {
    api.get('/customers', { params: { search } })
      .then(res => setCustomers(res.data.data))
      .catch(() => toast.error('Failed to load'))
  }

  useEffect(() => {
    fetchData()
  }, [search])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post('/customers', form)

      toast.success('Customer added')

      setShowModal(false)

      setForm({
        name: '',
        phone: '',
        email: '',
        address: '',
      })

      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    }
  }

  const totalCustomers = customers.length

  const totalPurchases = customers.reduce(
    (sum, customer) =>
      sum + Number(customer.totalPurchases || 0),
    0
  )

  const totalSpent = customers.reduce(
    (sum, customer) =>
      sum + Number(customer.totalSpent || 0),
    0
  )

  const openModal = () => {
    setForm({
      name: '',
      phone: '',
      email: '',
      address: '',
    })

    setShowModal(true)
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shadow-lg shadow-green-200">
            <Users className="text-white" size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Customers
            </h1>

            <p className="text-sm text-slate-500 mt-0.5">
              Manage your customer relationships and purchase history
            </p>
          </div>

        </div>

        <button
          onClick={openModal}
          className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:shadow-xl transition-all duration-200"
        >
          <Plus
            size={19}
            className="group-hover:rotate-90 transition-transform duration-200"
          />
          Add Customer
        </button>

      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Customers */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Customers
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalCustomers}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Registered customers
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Users
                className="text-emerald-600"
                size={21}
              />
            </div>

          </div>

        </div>

        {/* Purchases */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Purchases
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalPurchases.toLocaleString()}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Customer transactions
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <ShoppingCart
                className="text-blue-600"
                size={21}
              />
            </div>

          </div>

        </div>

        {/* Total Spent */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Spent
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                Rs {totalSpent.toLocaleString()}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Customer spending
              </p>
            </div>

            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
              <Wallet
                className="text-violet-600"
                size={21}
              />
            </div>

          </div>

        </div>

      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center gap-3">

          <div className="relative flex-1">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search customers by name, phone or email..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
            />

          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">

            <UserRound
              size={17}
              className="text-emerald-600"
            />

            <span className="text-sm font-semibold text-emerald-700">
              {customers.length} Customers
            </span>

          </div>

        </div>

      </div>

      {/* ================= CUSTOMER TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h2 className="font-bold text-slate-900">
              Customer Directory
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Customer information and purchase activity
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">

            <div className="w-2 h-2 rounded-full bg-emerald-500" />

            Customer Database

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="bg-slate-50/80 border-b border-slate-200">

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Customer
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Purchases
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Spent
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {customers.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="py-16 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <Users
                          className="text-slate-400"
                          size={25}
                        />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No customers found
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Try another search or add a new customer
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                customers.map(c => (

                  <tr
                    key={c._id}
                    className="group hover:bg-emerald-50/30 transition-colors"
                  >

                    {/* Customer */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center shrink-0">

                          <span className="text-sm font-bold text-emerald-700">
                            {c.name
                              ?.charAt(0)
                              ?.toUpperCase() || 'C'}
                          </span>

                        </div>

                        <div>

                          <p className="font-semibold text-slate-800">
                            {c.name}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            Customer
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">

                      {c.phone ? (

                        <div className="inline-flex items-center gap-2 text-slate-600">

                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Phone
                              size={13}
                              className="text-slate-500"
                            />
                          </div>

                          <span className="text-sm">
                            {c.phone}
                          </span>

                        </div>

                      ) : (

                        <span className="text-slate-400">
                          -
                        </span>

                      )}

                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">

                      {c.email ? (

                        <div className="inline-flex items-center gap-2 text-slate-600">

                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Mail
                              size={13}
                              className="text-slate-500"
                            />
                          </div>

                          <span className="text-sm">
                            {c.email}
                          </span>

                        </div>

                      ) : (

                        <span className="text-slate-400">
                          -
                        </span>

                      )}

                    </td>

                    {/* Purchases */}
                    <td className="px-5 py-4">

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold">

                        <ShoppingCart size={13} />

                        {c.totalPurchases || 0}

                      </span>

                    </td>

                    {/* Total */}
                    <td className="px-5 py-4">

                      <div>

                        <span className="font-bold text-slate-800">
                          Rs {c.totalSpent?.toLocaleString()}
                        </span>

                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Lifetime spending
                        </p>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= ADD CUSTOMER MODAL ================= */}
      {showModal && (

        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          {/* Overlay */}
          <div
            className="absolute inset-0"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">

                    <UserPlus size={21} />

                  </div>

                  <div>

                    <h2 className="text-lg font-bold">
                      Add Customer
                    </h2>

                    <p className="text-xs text-green-100 mt-0.5">
                      Create a new customer profile
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>

              </div>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* Name */}
              <div>

                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  Customer Name
                </label>

                <div className="relative">

                  <UserRound
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    placeholder="Enter customer name"
                    value={form.name}
                    onChange={e =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                    required
                  />

                </div>

              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Phone
                  </label>

                  <div className="relative">

                    <Phone
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={e =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Email
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={e =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                    />

                  </div>

                </div>

              </div>

              {/* Address */}
              <div>

                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  Address
                </label>

                <div className="relative">

                  <MapPin
                    size={17}
                    className="absolute left-4 top-3.5 text-slate-400"
                  />

                  <input
                    placeholder="Customer address"
                    value={form.address}
                    onChange={e =>
                      setForm({
                        ...form,
                        address: e.target.value,
                      })
                    }
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                  />

                </div>

              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-100 hover:from-emerald-700 hover:to-green-700 transition-all"
                >
                  <Save size={17} />
                  Save Customer
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}