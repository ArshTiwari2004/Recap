import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { UserProvider } from './context/UserContext'
//import { registerSW } from "virtual:pwa-register";

// const updateSW = registerSW({
//   onNeedRefresh() {
//     if (confirm("New version available. Reload?")) {
//       updateSW(true);
//     }
//   },
// });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
    <App />
    </UserProvider>
  </StrictMode>,
)