import './App.css'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';

function App() {

  return (
   <>
     <ToastContainer position="top-center" autoClose={3000} />
     <ScrollToTop />
   <Outlet/>
   <WhatsAppFloat />
   </>
  )
}

export default App
