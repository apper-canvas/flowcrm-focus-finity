import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const ContactCard = ({ contact, className = '' }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/contacts/${contact.Id}`)
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={handleClick}
      className={`card-interactive p-4 ${className}`}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
          {getInitials(contact.name)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-surface-900 truncate">{contact.name}</h3>
          <p className="text-sm text-surface-600 truncate">{contact.company}</p>
          <p className="text-sm text-surface-500 truncate">{contact.email}</p>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          {contact.tags && contact.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {contact.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="primary" size="sm">
                  {tag}
                </Badge>
              ))}
              {contact.tags.length > 2 && (
                <Badge variant="default" size="sm">
                  +{contact.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center text-xs text-surface-500">
            <ApperIcon name="Clock" className="w-3 h-3 mr-1" />
            {contact.lastContactedAt 
              ? format(new Date(contact.lastContactedAt), 'MMM d')
              : 'No contact'
            }
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ContactCard