import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/tailwind.css'
import ThemeProvider from './contexts/theme/ThemeProvider.tsx'
import ModalProvider from './contexts/modal/ModalProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ThemeProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </ThemeProvider>
  </StrictMode>
)
