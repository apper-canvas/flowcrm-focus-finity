import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/molecules/StatCard'
import DealCard from '@/components/molecules/DealCard'
import TaskItem from '@/components/molecules/TaskItem'
import ActivityItem from '@/components/molecules/ActivityItem'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { taskService } from '@/services/api/taskService'
import { activityService } from '@/services/api/activityService'

const Dashboard = () => {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [contactsData, dealsData, tasksData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getAll()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
      setTasks(tasksData)
      setActivities(activitiesData)
    } catch (err) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId)
  }

  const getDealById = (dealId) => {
    return deals.find(deal => deal.Id === dealId)
  }

  const getStats = () => {
    const totalDeals = deals.length
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0)
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won')
    const activeTasks = tasks.filter(task => task.status !== 'completed')
    
    return {
      totalContacts: contacts.length,
      totalDeals,
      totalValue,
      wonDeals: wonDeals.length,
      activeTasks: activeTasks.length,
      conversionRate: totalDeals > 0 ? Math.round((wonDeals.length / totalDeals) * 100) : 0
    }
  }

  const getRecentDeals = () => {
    return deals
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }

  const getTodaysTasks = () => {
    const today = new Date().toDateString()
    return tasks
      .filter(task => task.dueDate && new Date(task.dueDate).toDateString() === today)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
  }

  const getRecentActivities = () => {
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5)
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadDashboardData}
        className="min-h-[400px]"
      />
    )
  }

  const stats = getStats()
  const recentDeals = getRecentDeals()
  const todaysTasks = getTodaysTasks()
  const recentActivities = getRecentActivities()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Dashboard</h1>
          <p className="text-surface-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/contacts')}
            icon="Users"
          >
            View Contacts
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/deals')}
            icon="Target"
          >
            View Pipeline
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon="Users"
          color="primary"
        />
        <StatCard
          title="Active Deals"
          value={stats.totalDeals}
          icon="Target"
          color="secondary"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(stats.totalValue)}
          icon="DollarSign"
          color="accent"
        />
        <StatCard
          title="Win Rate"
          value={`${stats.conversionRate}%`}
          icon="TrendingUp"
          color="success"
          trend={stats.conversionRate > 50 ? "+12%" : "-5%"}
          trendType={stats.conversionRate > 50 ? "positive" : "negative"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-surface-900">Recent Deals</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/deals')}
              icon="ArrowRight"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentDeals.length === 0 ? (
              <Empty
                type="deals"
                onAction={() => navigate('/deals')}
                className="py-8"
              />
            ) : (
              recentDeals.map((deal) => (
                <DealCard
                  key={deal.Id}
                  deal={deal}
                  contact={getContactById(deal.contactId)}
                  className="hover:bg-surface-50 transition-colors"
                />
              ))
            )}
          </div>
        </motion.div>

        {/* Today's Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-surface-900">Today's Tasks</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/tasks')}
              icon="ArrowRight"
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {todaysTasks.length === 0 ? (
              <Empty
                type="tasks"
                onAction={() => navigate('/tasks')}
                className="py-8"
              />
            ) : (
              todaysTasks.map((task) => (
                <TaskItem
                  key={task.Id}
                  task={task}
                  contact={getContactById(task.contactId)}
                  deal={getDealById(task.dealId)}
                  className="hover:bg-surface-50 transition-colors"
                />
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-surface-900">Recent Activities</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/activities')}
            icon="ArrowRight"
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-3">
          {recentActivities.length === 0 ? (
            <Empty
              type="activities"
              className="py-8"
            />
          ) : (
            recentActivities.map((activity) => (
              <ActivityItem
                key={activity.Id}
                activity={activity}
                contact={getContactById(activity.contactId)}
                deal={getDealById(activity.dealId)}
              />
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Dashboard