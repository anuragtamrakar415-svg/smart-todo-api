import { createContext, useState, useContext, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

const extractMessage = (error, fallback) =>
  error.response?.data?.detail || error.message || fallback

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { data } = response.data

      localStorage.setItem('token', data.access_token)
      localStorage.setItem('user', JSON.stringify(data))
      setUser(data)

      toast.success('Welcome back')
      return { success: true }
    } catch (error) {
      const message = extractMessage(error, 'Login failed')
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const register = async (userData) => {
    try {
      await api.post('/auth/register', userData)
      toast.success('Account created — sign in to continue')
      return { success: true }
    } catch (error) {
      const message = extractMessage(error, 'Registration failed')
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Signed out')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
