import axios from 'axios'

// Matches the FastAPI backend's router prefix: app.include_router(..., prefix="/api/...")
// Override with VITE_API_URL in a .env file if the backend runs elsewhere.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((request) => {
  const token = localStorage.getItem('token')
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired/invalid — clear stale session so the UI doesn't get stuck
    // thinking the user is still logged in.
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

export default api
