import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#211D18',
            color: '#F5F0E6',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '8px',
            padding: '10px 14px',
          },
          success: { iconTheme: { primary: '#2B6E68', secondary: '#F5F0E6' } },
          error: { iconTheme: { primary: '#8C2F39', secondary: '#F5F0E6' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
