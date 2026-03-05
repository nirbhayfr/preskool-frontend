import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Buffer } from 'buffer'

window.Buffer = Buffer

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { registerSW } from 'virtual:pwa-register'

window.Buffer = Buffer

registerSW({ immediate: true })

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
