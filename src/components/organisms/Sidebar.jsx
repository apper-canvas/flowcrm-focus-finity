import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()
  
const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Deals', href: '/deals', icon: 'Target' },
    { name: 'Tasks', href: '/tasks', icon: 'CheckSquare' },
    { name: 'Activities', href: '/activities', icon: 'Activity' },
    { name: 'Custom Fields', href: '/custom-fields', icon: 'Settings' }
  ]
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -240
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-surface-200 z-30 lg:translate-x-0 lg:static lg:z-0"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-surface-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">FlowCRM</h1>
            </div>
            
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-surface-100 transition-colors lg:hidden"
            >
              <ApperIcon name="X" className="w-5 h-5 text-surface-600" />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      onClick={() => window.innerWidth < 1024 && onToggle()}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                            : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900'
                        }`
                      }
                    >
                      <ApperIcon 
                        name={item.icon} 
                        className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-surface-500 group-hover:text-surface-700'
                        }`} 
                      />
                      <span className="font-medium">{item.name}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-surface-200">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-surface-50 to-surface-100">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-surface-900">Admin User</p>
                <p className="text-xs text-surface-500">admin@flowcrm.com</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar