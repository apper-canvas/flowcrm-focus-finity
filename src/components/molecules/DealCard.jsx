import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const DealCard = ({ deal, contact, onEdit, className = '' }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'success'
    if (probability >= 50) return 'warning'
    return 'danger'
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`card p-4 cursor-pointer ${className}`}
      onClick={() => onEdit && onEdit(deal)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-surface-900 truncate flex-1 mr-2">
          {deal.title}
        </h3>
        <Badge variant={getProbabilityColor(deal.probability)} size="sm">
          {deal.probability}%
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold gradient-text">
          {formatCurrency(deal.value)}
        </div>
        
        {contact && (
          <div className="flex items-center text-sm text-surface-600">
            <ApperIcon name="User" className="w-4 h-4 mr-1" />
            {contact.name}
          </div>
        )}
        
        <div className="flex items-center text-sm text-surface-500">
          <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
          {deal.expectedCloseDate 
            ? format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')
            : 'No close date'
          }
        </div>
      </div>
    </motion.div>
  )
}

export default DealCard