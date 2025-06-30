import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  message = "Something went wrong", 
  onRetry = null, 
  className = "",
  type = "default" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'WifiOff',
          title: 'Connection Error',
          description: 'Unable to connect to the server. Please check your internet connection.'
        }
      case 'not-found':
        return {
          icon: 'SearchX',
          title: 'Not Found',
          description: 'The requested resource could not be found.'
        }
      case 'permission':
        return {
          icon: 'ShieldX',
          title: 'Access Denied',
          description: 'You do not have permission to access this resource.'
        }
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Error',
          description: message
        }
    }
  }

  const errorContent = getErrorContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon 
          name={errorContent.icon} 
          className="w-8 h-8 text-red-600" 
        />
      </div>
      
      <h3 className="text-lg font-semibold text-surface-900 mb-2">
        {errorContent.title}
      </h3>
      
      <p className="text-surface-600 mb-6 max-w-md">
        {errorContent.description}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error