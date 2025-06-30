import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend = null,
  trendType = 'positive',
  color = 'primary',
  className = '',
  ...props 
}) => {
  const colors = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    accent: 'from-accent-500 to-accent-600',
    success: 'from-green-500 to-green-600',
    warning: 'from-yellow-500 to-yellow-600',
    danger: 'from-red-500 to-red-600'
  }

  const trendColors = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-surface-600 bg-surface-100'
  }

  const trendIcons = {
    positive: 'TrendingUp',
    negative: 'TrendingDown',
    neutral: 'Minus'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`card p-6 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          
          {trend && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${trendColors[trendType]}`}>
              <ApperIcon name={trendIcons[trendType]} className="w-3 h-3 mr-1" />
              {trend}
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard