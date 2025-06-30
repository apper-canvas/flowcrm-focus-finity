import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { isToday, isOverdue, isPast } from 'date-fns'
import TaskItem from '@/components/molecules/TaskItem'
import TaskForm from '@/components/organisms/TaskForm'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { taskService } from '@/services/api/taskService'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { activityService } from '@/services/api/activityService'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterBy, setFilterBy] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [tasksData, contactsData, dealsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      
      setTasks(tasksData)
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError('Failed to load tasks data')
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply status/date filter
    if (filterBy !== 'all') {
      const today = new Date()
      
      switch (filterBy) {
        case 'today':
          filtered = filtered.filter(task => 
            task.dueDate && isToday(new Date(task.dueDate))
          )
          break
        case 'overdue':
          filtered = filtered.filter(task => 
            task.dueDate && isOverdue(new Date(task.dueDate)) && task.status !== 'completed'
          )
          break
        case 'completed':
          filtered = filtered.filter(task => task.status === 'completed')
          break
        case 'pending':
          filtered = filtered.filter(task => task.status === 'pending')
          break
        case 'in-progress':
          filtered = filtered.filter(task => task.status === 'in-progress')
          break
        case 'high':
          filtered = filtered.filter(task => task.priority === 'high')
          break
        case 'medium':
          filtered = filtered.filter(task => task.priority === 'medium')
          break
        case 'low':
          filtered = filtered.filter(task => task.priority === 'low')
          break
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case 'status':
          return a.status.localeCompare(b.status)
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    return filtered
  }, [tasks, searchQuery, filterBy, sortBy])

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData)
      setTasks(prev => [...prev, newTask])
      setShowForm(false)
      
      // Log activity
      await activityService.create({
        type: 'task',
        description: `Created new task: ${newTask.title}`,
        contactId: newTask.contactId,
        dealId: newTask.dealId,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      throw new Error('Failed to create task')
    }
  }

  const handleEditTask = async (taskData) => {
    try {
      const updatedTask = await taskService.update(editingTask.Id, taskData)
      setTasks(prev => prev.map(task => 
        task.Id === editingTask.Id ? updatedTask : task
      ))
      setEditingTask(null)
      setShowForm(false)
      
      // Log activity
      await activityService.create({
        type: 'task',
        description: `Updated task: ${updatedTask.title}`,
        contactId: updatedTask.contactId,
        dealId: updatedTask.dealId,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      throw new Error('Failed to update task')
    }
  }

  const handleToggleTask = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      const updatedTask = await taskService.update(task.Id, { status: newStatus })
      setTasks(prev => prev.map(t => 
        t.Id === task.Id ? updatedTask : t
      ))
      
      toast.success(`Task marked as ${newStatus}`)
      
      // Log activity
      await activityService.create({
        type: 'task',
        description: `Marked task as ${newStatus}: ${updatedTask.title}`,
        contactId: updatedTask.contactId,
        dealId: updatedTask.dealId,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success('Task deleted successfully')
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId)
  }

  const getDealById = (dealId) => {
    return deals.find(deal => deal.Id === dealId)
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const overdue = tasks.filter(t => 
      t.dueDate && isOverdue(new Date(t.dueDate)) && t.status !== 'completed'
    ).length
    const today = tasks.filter(t => 
      t.dueDate && isToday(new Date(t.dueDate)) && t.status !== 'completed'
    ).length
    
    return { total, completed, overdue, today }
  }

  const stats = getTaskStats()

  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'today', label: 'Due Today' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ]

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
    { value: 'title', label: 'Title' }
  ]

  if (loading) {
    return <Loading type="tasks" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900">Tasks</h1>
          <p className="text-surface-600 mt-1">
            Manage your tasks and stay organized
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          icon="Plus"
          variant="primary"
        >
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="CheckSquare" className="w-8 h-8 text-primary-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.total}</p>
              <p className="text-sm text-surface-600">Total Tasks</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Clock" className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.today}</p>
              <p className="text-sm text-surface-600">Due Today</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.overdue}</p>
              <p className="text-sm text-surface-600">Overdue</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{stats.completed}</p>
              <p className="text-sm text-surface-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search tasks..."
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

      {/* Task Form */}
      {showForm && (
        <TaskForm
          task={editingTask}
          contacts={contacts}
          deals={deals}
          onSubmit={editingTask ? handleEditTask : handleCreateTask}
          onCancel={() => {
            setShowForm(false)
            setEditingTask(null)
          }}
        />
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredAndSortedTasks.length === 0 ? (
          <Empty
            type={searchQuery ? "search" : "tasks"}
            onAction={searchQuery ? null : () => setShowForm(true)}
            className="py-12"
          />
        ) : (
          filteredAndSortedTasks.map((task, index) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <TaskItem
                task={task}
                contact={getContactById(task.contactId)}
                deal={getDealById(task.dealId)}
                onToggle={handleToggleTask}
                onEdit={(task) => {
                  setEditingTask(task)
                  setShowForm(true)
                }}
              />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default Tasks