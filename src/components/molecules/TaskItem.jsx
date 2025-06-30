import { motion } from 'framer-motion'
import { format, isPast, isToday } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
const TaskItem = ({ task, contact, deal, onToggle, onEdit, className = '' }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger'
      case 'medium': return 'warning'
      case 'low': return 'success'
      default: return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'warning'
      case 'pending': return 'default'
      default: return 'default'
    }
  }

const getDueDateColor = (dueDate) => {
    if (!dueDate) return 'text-surface-500'
    const date = new Date(dueDate)
    if (isPast(date)) return 'text-red-600'
    if (isToday(date)) return 'text-yellow-600'
    return 'text-surface-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`card p-4 ${className}`}
    >
      <div className="flex items-start space-x-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle && onToggle(task)}
          className="flex-shrink-0 mt-1"
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            task.status === 'completed' 
              ? 'bg-accent-500 border-accent-500' 
              : 'border-surface-300 hover:border-accent-500'
          }`}>
            {task.status === 'completed' && (
              <ApperIcon name="Check" className="w-3 h-3 text-white" />
            )}
          </div>
        </motion.button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-surface-500' : 'text-surface-900'}`}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-2 ml-2">
              <Badge variant={getPriorityColor(task.priority)} size="sm">
                {task.priority}
              </Badge>
              <Badge variant={getStatusColor(task.status)} size="sm">
                {task.status}
              </Badge>
            </div>
          </div>
          
          {task.description && (
            <p className="text-sm text-surface-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4 text-sm text-surface-500">
              {task.dueDate && (
                <div className={`flex items-center ${getDueDateColor(task.dueDate)}`}>
                  <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
              )}
              
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
            
            {onEdit && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(task)}
                className="text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskItem