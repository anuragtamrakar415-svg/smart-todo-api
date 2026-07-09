import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    const result = await register(formData)
    setLoading(false)

    if (result.success) navigate('/login')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="ruled-card pl-12 pr-8 py-8 w-full max-w-md">
        <span className="eyebrow">New here</span>
        <h1 className="font-display text-3xl font-semibold mt-1 mb-6">Create an account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="field-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="field-input"
              placeholder="johndoe"
              required
              minLength={3}
            />
          </div>

          <div>
            <label className="field-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="field-input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="field-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="field-input"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="field-label">Confirm password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="field-input"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-soft mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-medium hover:text-brand-dark">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
