import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true, // register as soon as possible
  onRegisteredSW(reg: unknown) {
    console.log('SW registered:', reg);
  },
  onRegisterError(error: unknown) {
    console.error('SW registration error:', error);
  },
  onNeedRefresh() {
    console.log('SW needs refresh');
  },
  onOfflineReady() {
    console.log('SW offline ready');
  },
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <App />
      </BrowserRouter> 
    </Provider>
  </StrictMode>,
)