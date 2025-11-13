import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TimerTest from './components/TimeTest.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TimerTest />
  </StrictMode>,
)
