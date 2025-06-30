import { useState } from 'react'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleSearch = (query) => {
    // Global search functionality can be implemented here
    console.log('Global search:', query)
  }

  return (
    <div className="flex h-screen bg-surface-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={handleMenuToggle}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={handleMenuToggle}
          onSearch={handleSearch}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout