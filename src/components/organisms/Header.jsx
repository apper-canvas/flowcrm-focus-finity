import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'

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
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header