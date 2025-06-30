import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import React, { useContext, useState } from "react";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false)

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName[0] : ''
    const last = lastName ? lastName[0] : ''
    return (first + last).toUpperCase() || 'U'
  }

  const handleLogout = async () => {
    setShowDropdown(false)
    await logout()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm hover:scale-105 transition-transform"
      >
        {user ? getInitials(user.firstName, user.lastName) : 'U'}
      </button>
      
      {showDropdown && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-surface-200 py-2 z-50"
        >
          {user && (
            <div className="px-4 py-2 border-b border-surface-200">
              <p className="font-medium text-surface-900">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-surface-600">{user.emailAddress}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-surface-700 hover:bg-surface-50 flex items-center"
          >
            <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
            Logout
          </button>
        </motion.div>
      )}
    </div>
  )
}

const Header = ({ onMenuToggle, onSearch }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-surface-200 px-4 lg:px-6 py-4"
    >
      <div className="flex items-center justify-between">
<div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5 text-surface-600" />
          </button>
          <div className="hidden md:block">
            <SearchBar 
              onSearch={onSearch}
              placeholder="Search contacts, deals, tasks..."
              className="w-96"
            />
          </div>
        </div>

<div className="flex items-center space-x-3">
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <ApperIcon name="Search" className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" className="w-4 h-4" />
          </Button>
          
          <UserProfile />
        </div>
      </div>
    </motion.header>
  )
}

export default Header