import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bus, Ticket, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'


export default function Navbar(){
  const { user, loading, logout } = useAuth()
  const nav = useNavigate()

  const linkClass = ({isActive}) => `px-3 py-2 rounded-md text-sm font-medium transition
    ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`

  async function doLogout(){
    await logout()
    nav('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-600/10">
            <Bus className="h-5 w-5 text-blue-700" />
          </div>
          <span className="font-semibold text-lg tracking-wide">E-Bus Pass</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/team" className={linkClass}>Team</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          {user?.role === 'admin' && (
            <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!loading && !user && (
            <>
              <NavLink to="/login" className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">Login</NavLink>
              <NavLink to="/signup" className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">
                <Ticket className="h-4 w-4" /> Sign Up
              </NavLink>
            </>
          )}
          {!loading && user && (
            <>
              <NavLink to="/profile" className="px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 inline-flex items-center gap-2">
                <User className="h-4 w-4" /> {user.email || 'Profile'}
              </NavLink>
              <button onClick={doLogout} className="px-3 py-2 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-black inline-flex items-center gap-2">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
