import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const ActivityItem = ({ activity, contact, deal, className = '' }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'email': return 'Mail'
      case 'call': return 'Phone'
      case 'meeting': return 'Calendar'
      case 'note': return 'FileText'
      case 'task': return 'CheckSquare'
      case 'deal': return 'Target'
      case 'contact': return 'User'
      default: return 'Activity'
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'email': return 'primary'
      case 'call': return 'accent'
      case 'meeting': return 'secondary'
      case 'note': return 'info'
      case 'task': return 'success'
      case 'deal': return 'warning'
      case 'contact': return 'default'
      default: return 'default'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`card p-4 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-${getActivityColor(activity.type)}-500 to-${getActivityColor(activity.type)}-600 flex items-center justify-center flex-shrink-0`}>
          <ApperIcon name={getActivityIcon(activity.type)} className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-surface-900 font-medium">
                {activity.description}
              </p>
              
              <div className="flex items-center space-x-3 mt-2 text-sm text-surface-500">
                <div className="flex items-center">
                  <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                  {format(new Date(activity.timestamp), 'MMM d, yyyy HH:mm')}
                </div>
                
{contact && (
                  <div className="flex items-center">
                    <ApperIcon name="User" className="w-4 h-4 mr-1" />
                    {contact.Name}
                  </div>
                )}
                {deal && (
                  <div className="flex items-center">
                    <ApperIcon name="Target" className="w-4 h-4 mr-1" />
                    {deal.title}
                  </div>
                )}
              </div>
            </div>
            
            <Badge variant={getActivityColor(activity.type)} size="sm">
              {activity.type}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ActivityItem