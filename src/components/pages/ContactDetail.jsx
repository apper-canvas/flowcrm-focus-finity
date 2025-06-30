import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import DealCard from '@/components/molecules/DealCard'
import TaskItem from '@/components/molecules/TaskItem'
import ActivityItem from '@/components/molecules/ActivityItem'
import ApperIcon from '@/components/ApperIcon'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { taskService } from '@/services/api/taskService'
import { activityService } from '@/services/api/activityService'

const ContactDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [deals, setDeals] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadContactData()
  }, [id])

  const loadContactData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const contactId = parseInt(id)
      
      const [contactData, dealsData, tasksData, activitiesData] = await Promise.all([
        contactService.getById(contactId),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ])
      
      if (!contactData) {
        setError('Contact not found')
        return
      }
      
      setContact(contactData)
      setDeals(dealsData.filter(deal => deal.contactId === contactId))
      setTasks(tasksData.filter(task => task.contactId === contactId))
      setActivities(activitiesData.filter(activity => activity.contactId === contactId))
    } catch (err) {
      setError('Failed to load contact data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContact = async () => {
    if (!confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return
    }

    try {
      await contactService.delete(contact.Id)
      toast.success('Contact deleted successfully')
      navigate('/contacts')
    } catch (error) {
      toast.error('Failed to delete contact')
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'deals', label: 'Deals', icon: 'Target', count: deals.length },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare', count: tasks.length },
    { id: 'activities', label: 'Activities', icon: 'Activity', count: activities.length }
  ]

  if (loading) {
    return <Loading type="contacts" />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadContactData}
        className="min-h-[400px]"
      />
    )
  }

  if (!contact) {
    return (
      <Error 
        message="Contact not found" 
        type="not-found"
        className="min-h-[400px]"
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={() => navigate('/contacts')}
          variant="ghost"
          icon="ArrowLeft"
        >
          Back to Contacts
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            icon="Edit"
          >
            Edit Contact
          </Button>
          <Button
            variant="danger"
            icon="Trash2"
            onClick={handleDeleteContact}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Contact Header */}
      <div className="card p-6">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(contact.name)}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-surface-900">{contact.name}</h1>
            <p className="text-lg text-surface-600 mt-1">{contact.position}</p>
            <p className="text-surface-600">{contact.company}</p>
            
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center text-surface-600">
                <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                <a href={`mailto:${contact.email}`} className="hover:text-primary-600">
                  {contact.email}
                </a>
              </div>
              
              {contact.phone && (
                <div className="flex items-center text-surface-600">
                  <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                  <a href={`tel:${contact.phone}`} className="hover:text-primary-600">
                    {contact.phone}
                  </a>
                </div>
              )}
              
              <div className="flex items-center text-surface-500">
                <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                Added {format(new Date(contact.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
            
            {contact.tags && contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {contact.tags.map((tag, index) => (
                  <Badge key={index} variant="primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge variant="default" size="sm">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-surface-500">Full Name</label>
                    <p className="font-medium text-surface-900">{contact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-surface-500">Email</label>
                    <p className="font-medium text-surface-900">{contact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-surface-500">Phone</label>
                    <p className="font-medium text-surface-900">{contact.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-surface-500">Company</label>
                    <p className="font-medium text-surface-900">{contact.company}</p>
                  </div>
                  <div>
                    <label className="text-sm text-surface-500">Position</label>
                    <p className="font-medium text-surface-900">{contact.position}</p>
                  </div>
                  <div>
                    <label className="text-sm text-surface-500">Last Contacted</label>
                    <p className="font-medium text-surface-900">
                      {contact.lastContactedAt 
                        ? format(new Date(contact.lastContactedAt), 'MMM d, yyyy')
                        : 'Never'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-surface-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">Active Deals</span>
                    <span className="font-semibold text-surface-900">{deals.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">Open Tasks</span>
                    <span className="font-semibold text-surface-900">
                      {tasks.filter(t => t.status !== 'completed').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">Activities</span>
                    <span className="font-semibold text-surface-900">{activities.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'deals' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {deals.length === 0 ? (
              <Empty
                type="deals"
                onAction={() => navigate('/deals')}
                className="py-12"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deals.map((deal) => (
                  <DealCard
                    key={deal.Id}
                    deal={deal}
                    contact={contact}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'tasks' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {tasks.length === 0 ? (
              <Empty
                type="tasks"
                onAction={() => navigate('/tasks')}
                className="py-12"
              />
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task.Id}
                  task={task}
                  contact={contact}
                />
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'activities' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {activities.length === 0 ? (
              <Empty
                type="activities"
                className="py-12"
              />
            ) : (
              activities.map((activity) => (
                <ActivityItem
                  key={activity.Id}
                  activity={activity}
                  contact={contact}
                />
              ))
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ContactDetail