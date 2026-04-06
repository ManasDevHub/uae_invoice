import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Shield, Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { username: 'admin', password: 'Admin@123', role: 'Admin', color: '#7c3aed' },
  { username: 'analyst', password: 'Analyst@123', role: 'Analyst', color: '#1a6fcf' },
  { username: 'viewer', password: 'Viewer@123', role: 'Viewer', color: '#0d7c66' },
]

export default function Login() {
  const { login, loading, error } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    if (!username.trim() || !password.trim()) {
      setLocalError('Please enter username and password')
      return
    }
    await login(username.trim(), password)
  }

  const fillDemo = (acc) => {
    setUsername(acc.username)
    setPassword(acc.password)
    setLocalError('')
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1630] to-[#091428] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#1a6fcf]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#7c3aed]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1a3a6f]/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(26,111,207,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,111,207,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a6fcf] to-[#0d4a9e] shadow-2xl shadow-[#1a6fcf]/30 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Adamas Tech</h1>
          <p className="text-[#8899cc] mt-1 text-sm">UAE PINT AE E-Invoice Engine</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-[#1a6fcf]/10 border border-[#1a6fcf]/20 rounded-full px-4 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-xs text-[#8899cc] font-medium">System Online · PINT AE v1.0</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-[#1e3a5f]/40 rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Sign in to your account</h2>
            <p className="text-[#6b7a9e] text-sm mt-1">Enter your credentials to access the platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-[#8899cc] uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full bg-[#0d1630] border border-[#1e3a5f] rounded-xl px-4 py-3 text-white placeholder-[#3d5a8a] text-sm focus:outline-none focus:border-[#1a6fcf] focus:ring-2 focus:ring-[#1a6fcf]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#8899cc] uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full bg-[#0d1630] border border-[#1e3a5f] rounded-xl px-4 py-3 pr-12 text-white placeholder-[#3d5a8a] text-sm focus:outline-none focus:border-[#1a6fcf] focus:ring-2 focus:ring-[#1a6fcf]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3d5a8a] hover:text-[#8899cc] transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {displayError && (
              <div className="flex items-center gap-3 bg-[#e53e3e]/10 border border-[#e53e3e]/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-[#e53e3e] shrink-0" />
                <p className="text-[#e53e3e] text-sm">{displayError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#1a6fcf] to-[#1558a8] hover:from-[#1a7ae0] hover:to-[#1a6fcf] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-6 py-3.5 text-sm transition-all duration-200 shadow-lg shadow-[#1a6fcf]/25 hover:shadow-[#1a6fcf]/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1e3a5f]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#111827] px-4 text-xs text-[#3d5a8a] font-medium">QUICK ACCESS — DEMO ACCOUNTS</span>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button
                key={acc.username}
                onClick={() => fillDemo(acc)}
                className="flex flex-col items-center gap-2 p-3 bg-[#0d1630] border border-[#1e3a5f] hover:border-[#1a6fcf]/50 rounded-xl transition-all duration-200 hover:bg-[#0d1a36] group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${acc.color}, ${acc.color}99)` }}
                >
                  {acc.username[0].toUpperCase()}
                </div>
                <div className="text-center">
                  <div className="text-white text-xs font-semibold capitalize group-hover:text-[#60a5fa] transition-colors">{acc.username}</div>
                  <div className="text-[#3d5a8a] text-[10px]">{acc.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#3d5a8a] text-xs mt-6">
          © 2024 Adamas Tech Consulting · UAE E-Invoicing Compliance Platform
        </p>
      </div>
    </div>
  )
}
