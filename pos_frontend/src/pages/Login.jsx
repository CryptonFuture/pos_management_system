
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Store,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('admin@pos.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-green-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '45px 45px',
          }}
        />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-7">

          <div className="relative inline-flex mb-5">
            <div className="absolute inset-0 rounded-2xl bg-green-500/30 blur-xl" />

            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl shadow-green-900/40">
              <Store size={30} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight">
            POS System
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Manage your business with confidence
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* Card Header */}
          <div className="px-7 pt-7 pb-5">
            <div className="flex items-start justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Welcome back
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Sign in to continue to your dashboard
                </p>
              </div>

              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 border border-green-100">
                <ShieldCheck
                  size={14}
                  className="text-green-600"
                />

                <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">
                  Secure
                </span>
              </div>

            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="px-7 pb-7 space-y-5"
          >

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="
                    w-full
                    pl-11 pr-4 py-3
                    bg-slate-50
                    border border-slate-200
                    rounded-xl
                    text-sm text-slate-800
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:border-green-500
                    focus:ring-4 focus:ring-green-500/10
                  "
                  required
                />

              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="
                    w-full
                    pl-11 pr-11 py-3
                    bg-slate-50
                    border border-slate-200
                    rounded-xl
                    text-sm text-slate-800
                    outline-none
                    transition-all
                    placeholder:text-slate-400
                    focus:bg-white
                    focus:border-green-500
                    focus:ring-4 focus:ring-green-500/10
                  "
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute right-3.5 top-1/2 -translate-y-1/2
                    text-slate-400
                    hover:text-slate-700
                    transition
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                group
                w-full
                flex items-center justify-center gap-2
                py-3.5
                rounded-xl
                bg-gradient-to-r from-green-600 to-emerald-600
                hover:from-green-700 hover:to-emerald-700
                text-white
                font-semibold
                text-sm
                shadow-lg shadow-green-600/20
                transition-all duration-200
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Demo Login */}
          <div className="mx-7 mb-7">

            <div className="h-px bg-slate-100 mb-5" />

            <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-4">

              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-bold text-green-900">
                    Demo Accounts
                  </p>

                  <p className="text-[10px] text-green-700 mt-0.5">
                    Quick access for testing
                  </p>
                </div>

                <div className="px-2 py-1 rounded-md bg-green-100 text-[9px] font-bold text-green-700 uppercase">
                  Demo
                </div>
              </div>

              <div className="space-y-2">

                <div className="flex items-center justify-between gap-3 bg-white rounded-xl px-3 py-2.5 border border-green-100">
                  <span className="text-xs font-semibold text-slate-600">
                    Admin
                  </span>

                  <span className="text-[11px] font-mono text-green-700">
                    admin@pos.com / admin123
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 bg-white rounded-xl px-3 py-2.5 border border-green-100">
                  <span className="text-xs font-semibold text-slate-600">
                    Cashier
                  </span>

                  <span className="text-[11px] font-mono text-green-700">
                    cashier@pos.com / cashier123
                  </span>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Secure Point of Sale Management
        </p>

      </div>
    </div>
  )
}

