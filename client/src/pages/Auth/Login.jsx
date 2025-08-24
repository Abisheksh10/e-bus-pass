import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  function set(k,v){ setForm(p=>({...p,[k]:v})) }

  async function submit(e){
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      const res = await login(form)
      // If backend sets role in /auth/me, refreshMe covers it; we simply go home or profile
      if (res?.role === 'admin') {
        nav('/admin')
      } else {
        nav('/')
      }
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow-sm border">
      <h1 className="text-2xl font-semibold mb-1">Student Login</h1>
      <p className="text-gray-600 mb-4">Access your dashboard and manage your bus pass.</p>
      {err && <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}

      <form onSubmit={submit} className="space-y-3">
        <div className="relative">
          <Mail className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="email"
            className="w-full border rounded-md p-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            placeholder="Email"
            value={form.email}
            onChange={e=>set('email', e.target.value)}
            required
          />
        </div>
        <div className="relative">
          <Lock className="h-4 w-4 text-gray-500 absolute left-3 top-3" />
          <input
            type={showPwd ? 'text' : 'password'}
            className="w-full border rounded-md p-2 pl-9 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            placeholder="Password"
            value={form.password}
            onChange={e=>set('password', e.target.value)}
            required
          />
          <button type="button"
            onClick={()=>setShowPwd(s=>!s)}
            className="text-sm absolute right-2 top-2 px-2 py-1 rounded hover:bg-gray-100"
          >
            {showPwd ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          disabled={busy}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Login <LogIn className="h-4 w-4" />
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Don’t have an account? <a href="/signup" className="text-blue-700 hover:underline">Sign up</a>
      </p>
      <p className="text-sm text-gray-600 mt-1">
        Are you an admin? <a href="/admin/login" className="text-blue-700 hover:underline">Admin login</a>
      </p>
    </div>
  )
}
