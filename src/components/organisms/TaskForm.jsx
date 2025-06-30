import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'

const TaskForm = ({ task = null, contacts = [], deals = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    status: task?.status || 'pending',
    priority: task?.priority || 'medium',
    contactId: task?.contactId || '',
    dealId: task?.dealId || ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ]

const contactOptions = contacts.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.Name} - ${contact.company}`
  }))

  const dealOptions = deals.map(deal => ({
    value: deal.Id.toString(),
    label: deal.title
  }))

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const taskData = {
        ...formData,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      }
      
      await onSubmit(taskData)
      toast.success(task ? 'Task updated successfully!' : 'Task created successfully!')
    } catch (error) {
      toast.error('Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-surface-900">
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          icon="X"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          icon="CheckSquare"
          required
        />
        
        <div>
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="form-input"
            placeholder="Task description..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            icon="Calendar"
          />
          
          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            options={priorityOptions}
          />
          
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
          />
          
          <Select
            label="Related Contact"
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            options={contactOptions}
            placeholder="Select a contact (optional)"
          />
        </div>

        <Select
          label="Related Deal"
          name="dealId"
          value={formData.dealId}
          onChange={handleChange}
          options={dealOptions}
          placeholder="Select a deal (optional)"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            icon={task ? "Save" : "Plus"}
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

export default TaskForm