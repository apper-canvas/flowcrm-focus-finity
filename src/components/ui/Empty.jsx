import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item",
  actionLabel = "Create New",
  onAction = null,
  icon = "Inbox",
  className = "",
  type = "default"
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case 'contacts':
        return {
          icon: 'Users',
          title: 'No contacts yet',
          description: 'Start building your customer relationships by adding your first contact',
          actionLabel: 'Add Contact'
        }
      case 'deals':
        return {
          icon: 'Target',
          title: 'No deals in pipeline',
          description: 'Create your first deal to start tracking sales opportunities',
          actionLabel: 'Create Deal'
        }
      case 'tasks':
        return {
          icon: 'CheckSquare',
          title: 'All caught up!',
          description: 'No tasks to show. Great job staying on top of everything!',
          actionLabel: 'Add Task'
        }
      case 'activities':
        return {
          icon: 'Activity',
          title: 'No recent activity',
          description: 'Customer interactions and system activities will appear here',
          actionLabel: null
        }
      case 'search':
        return {
          icon: 'Search',
          title: 'No results found',
          description: 'Try adjusting your search terms or filters',
          actionLabel: null
        }
      default:
        return { icon, title, description, actionLabel }
    }
  }

  const emptyContent = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-surface-100 to-surface-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon 
          name={emptyContent.icon} 
          className="w-10 h-10 text-surface-400" 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-surface-900 mb-2">
        {emptyContent.title}
      </h3>
      
      <p className="text-surface-600 mb-8 max-w-md">
        {emptyContent.description}
      </p>
      
      {emptyContent.actionLabel && onAction && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAction}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{emptyContent.actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty