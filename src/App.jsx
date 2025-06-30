import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import Layout from '@/components/organisms/Layout'
import Dashboard from '@/components/pages/Dashboard'
import Contacts from '@/components/pages/Contacts'
import ContactDetail from '@/components/pages/ContactDetail'
import Deals from '@/components/pages/Deals'
import Tasks from '@/components/pages/Tasks'
import Activities from '@/components/pages/Activities'

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetail />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/activities" element={<Activities />} />
          </Routes>
        </Layout>
      </Router>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App