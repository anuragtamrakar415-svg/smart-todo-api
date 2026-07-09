import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiLogOut, FiCheckSquare } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-5 py-3.5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-md border-2 border-ink flex items-center justify-center group-hover:border-brand transition-colors">
            <FiCheckSquare className="text-ink group-hover:text-brand transition-colors" size={15} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">Ruled</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`hidden sm:inline text-sm font-medium transition-colors ${
                  location.pathname === '/dashboard' ? 'text-brand' : 'text-ink-soft hover:text-ink'
                }`}
              >
                Dashboard
              </Link>
              <span className="hidden sm:inline eyebrow">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-rust transition-colors"
              >
                <FiLogOut size={15} /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                Sign in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
