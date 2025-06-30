import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isYesterday, subDays, startOfDay } from 'date-fns'
import ActivityItem from '@/components/molecules/ActivityItem'
import SearchBar from '@/components/molecules/SearchBar'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { activityService } from '@/services/api/activityService'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      
      setActivities(activitiesData)
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError('Failed to load activities data')
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activities

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply type/date filter
    if (filterBy !== 'all') {
      const today = new Date()
      
      switch (filterBy) {
        case 'today':
          filtered = filtered.filter(activity => 
            isToday(new Date(activity.timestamp))
          )
          break
        case 'yesterday':
          filtered = filtered.filter(activity => 
            isYesterday(new Date(activity.timestamp))
          )
          break
        case 'last7days':
          const sevenDaysAgo = subDays(today, 7)
          filtered = filtered.filter(activity => 
            new Date(activity.timestamp) >= sevenDaysAgo
          )
          break
        case 'email':
        case 'call':
        case 'meeting':
        case 'note':
        case 'task':
        case 'deal':
        case 'contact':
          filtered = filtered.filter(activity => activity.type === filterBy)
          break
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp)
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp)
        case 'type':
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })

    return filtered
  }, [activities, searchQuery, filterBy, sortBy])

  const groupedActivities = useMemo(() => {
    const groups = {}
    
    filteredAndSortedActivities.forEach(activity => {
      const date = new Date(activity.timestamp)
      let groupKey
      
      if (isToday(date)) {
        groupKey = 'Today'
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday'
      } else {
        groupKey = format(date, 'MMMM d, yyyy')
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(activity)
    })
    
    return groups
  }, [filteredAndSortedActivities])

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId)
  }

  const getDealById = (dealId) => {
    return deals.find(deal => deal.Id === dealId)
  }

  const getActivityStats = () => {
    const total = activities.length
    const today = activities.filter(a => isToday(new Date(a.timestamp))).length
    const thisWeek = activities.filter(a => 
      new Date(a.timestamp) >= subDays(new Date(), 7)
    ).length
    
    const typeStats = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {})
    
    return { total, today, thisWeek, typeStats }
  }

  const stats = getActivityStats()

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'email', label: 'Emails' },
    { value: 'call', label: 'Calls' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'note', label: 'Notes' },
    { value: 'task', label: 'Tasks' },
    { value: 'deal', label: 'Deals' },
    { value: 'contact', label: 'Contacts' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'type', label: 'Activity Type' }
  ]

  if (loading) {
    return <Loading type="activities" />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadData}
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
      <div>
        <h1 className="text-3xl font-bold text-surface-900">Activities</h1>
        <p className="text-surface-600 mt-1">
          Track all interactions and system activities
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Activity" className="w-8 h-8 text-primary-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.total}</p>
              <p className="text-sm text-surface-600">Total Activities</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Clock" className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.today}</p>
              <p className="text-sm text-surface-600">Today</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Calendar" className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.thisWeek}</p>
              <p className="text-sm text-surface-600">This Week</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Mail" className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.typeStats.email || 0}</p>
              <p className="text-sm text-surface-600">Emails</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Type Stats */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Activity Breakdown</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.typeStats).map(([type, count]) => (
            <Badge key={type} variant="primary" size="lg">
              {type}: {count}
            </Badge>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search activities..."
          className="flex-1"
        />
        
        <div className="flex gap-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
            className="w-40"
          />
          
          <Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            options={filterOptions}
            className="w-40"
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-6">
        {Object.keys(groupedActivities).length === 0 ? (
          <Empty
            type={searchQuery ? "search" : "activities"}
            className="py-12"
          />
        ) : (
          Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-surface-900">{date}</h3>
                <div className="flex-1 h-px bg-surface-200"></div>
                <Badge variant="default" size="sm">
                  {dateActivities.length} activities
                </Badge>
              </div>
              
              <div className="space-y-3">
                {dateActivities.map((activity, index) => (
                  <motion.div
                    key={activity.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ActivityItem
                      activity={activity}
                      contact={getContactById(activity.contactId)}
                      deal={getDealById(activity.dealId)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default Activities