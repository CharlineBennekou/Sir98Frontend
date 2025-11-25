import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import 'bootstrap/dist/css/bootstrap.css';

//import TimerTest from './components/TimeTest.tsx'
//import { registerSW } from 'virtual:pwa-register'

// // Register SW using the plugin's virtual import
// registerSW({
//   immediate: true, // register as soon as possible
//   onRegisteredSW(reg) {
//     console.log('SW registered:', reg);
//   },
//   onRegisterError(error) {
//     console.error('SW registration error:', error);
//   },
//   onNeedRefresh() {
//     console.log('SW needs refresh');
//   },
//   onOfflineReady() {
//     console.log('SW offline ready');
//   },
// })


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)