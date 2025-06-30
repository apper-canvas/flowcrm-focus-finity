import { useState } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...",
  className = '',
  autoFocus = false
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e) => {
    const value = e.target.value
    setQuery(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" 
        />
        
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`
            w-full pl-10 pr-10 py-2.5 border border-surface-300 rounded-lg
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            transition-all duration-200
            ${isFocused ? 'shadow-lg' : 'shadow-sm'}
          `}
        />
        
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default SearchBar