import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider } from '@tanstack/react-query'
import '../css/app.css'
import App from './components/App'
import { queryClient } from './lib/queryClient'

const rootEl = document.getElementById('root')
if (rootEl) {
  const rawBasename =
    (import.meta.env.VITE_ROUTER_BASENAME as string | undefined) ||
    (typeof window !== 'undefined' ? window.__AMTDEX_CONFIG__?.basename : undefined) ||
    '/'
  const basename = rawBasename === '/' ? undefined : rawBasename

  createRoot(rootEl).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter basename={basename}>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}

export default App
