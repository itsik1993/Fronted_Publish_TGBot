import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './components/Context/AuthGlobalContxt.jsx';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';



axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;
const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  // <StrictMode>
 <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <App />
      <ToastContainer />
    </AuthProvider>
  </QueryClientProvider>
  // </StrictMode>,
)
