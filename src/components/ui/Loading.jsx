import { motion } from 'framer-motion'

const Loading = ({ type = 'default', className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'contacts':
        return (
          <div className={`space-y-4 ${className}`}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="card p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-surface-200 rounded-full shimmer"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-surface-200 rounded w-3/4 mb-2 shimmer"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2 shimmer"></div>
                  </div>
                  <div className="w-16 h-8 bg-surface-200 rounded shimmer"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case 'deals':
        return (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="card p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-6 bg-surface-200 rounded w-3/4 mb-4 shimmer"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-16 bg-surface-200 rounded shimmer"></div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case 'tasks':
        return (
          <div className={`space-y-3 ${className}`}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="card p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-surface-200 rounded shimmer"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-surface-200 rounded w-3/4 mb-1 shimmer"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2 shimmer"></div>
                  </div>
                  <div className="w-20 h-6 bg-surface-200 rounded shimmer"></div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      
      case 'dashboard':
        return (
          <div className={`space-y-6 ${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="h-8 bg-surface-200 rounded w-1/2 mb-4 shimmer"></div>
                  <div className="h-12 bg-surface-200 rounded w-3/4 shimmer"></div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="h-6 bg-surface-200 rounded w-1/3 mb-4 shimmer"></div>
                <div className="h-64 bg-surface-200 rounded shimmer"></div>
              </motion.div>
              <motion.div
                className="card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="h-6 bg-surface-200 rounded w-1/3 mb-4 shimmer"></div>
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-surface-200 rounded shimmer"></div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className={`space-y-4 ${className}`}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="card p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-4 bg-surface-200 rounded w-3/4 mb-2 shimmer"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2 shimmer"></div>
              </motion.div>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="animate-pulse">
      {renderSkeleton()}
    </div>
  )
}

export default Loading