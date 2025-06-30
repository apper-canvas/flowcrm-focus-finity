import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { customFieldService } from '@/services/api/customFieldService'

const CustomFields = () => {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [formData, setFormData] = useState({
    label: '',
    type: 'text',
    entity: 'contact',
    required: false,
    placeholder: '',
    options: []
  })
  const [optionInput, setOptionInput] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    loadFields()
  }, [])

  const loadFields = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await customFieldService.getAll()
      setFields(data)
    } catch (err) {
      setError('Failed to load custom fields')
    } finally {
      setLoading(false)
    }
  }

  const handleShowForm = () => {
    setEditingField(null)
    setFormData({
      label: '',
      type: 'text',
      entity: 'contact',
      required: false,
      placeholder: '',
      options: []
    })
    setOptionInput('')
    setShowForm(true)
  }

  const handleEditField = (field) => {
    setEditingField(field)
    setFormData({
      label: field.label,
      type: field.type,
      entity: field.entity,
      required: field.required,
      placeholder: field.placeholder || '',
      options: field.options || []
    })
    setOptionInput('')
    setShowForm(true)
  }

  const handleDeleteField = async (fieldId) => {
    if (!confirm('Are you sure you want to delete this custom field?')) return

    try {
      await customFieldService.delete(fieldId)
      setFields(prev => prev.filter(field => field.Id !== fieldId))
      toast.success('Custom field deleted successfully')
    } catch (error) {
      toast.error('Failed to delete custom field')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.label.trim()) {
      toast.error('Field label is required')
      return
    }

    setFormLoading(true)

    try {
      if (editingField) {
        const updatedField = await customFieldService.update(editingField.Id, formData)
        setFields(prev => prev.map(field => 
          field.Id === editingField.Id ? updatedField : field
        ))
        toast.success('Custom field updated successfully')
      } else {
        const newField = await customFieldService.create(formData)
        setFields(prev => [...prev, newField])
        toast.success('Custom field created successfully')
      }

      setShowForm(false)
      setEditingField(null)
    } catch (error) {
      toast.error('Failed to save custom field')
    } finally {
      setFormLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addOption = () => {
    if (optionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, optionInput.trim()]
      }))
      setOptionInput('')
    }
  }

  const removeOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const typeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Select Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date' }
  ]

  const entityOptions = [
    { value: 'contact', label: 'Contact' },
    { value: 'deal', label: 'Deal' }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'text': return 'Type'
      case 'number': return 'Hash'
      case 'select': return 'List'
      case 'checkbox': return 'CheckSquare'
      case 'date': return 'Calendar'
      default: return 'Circle'
    }
  }

  if (loading) {
    return <Loading type="custom-fields" />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadFields}
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
          <h1 className="text-3xl font-bold text-surface-900">Custom Fields</h1>
          <p className="text-surface-600 mt-1">
            Define additional data points for contacts and deals
          </p>
        </div>
        
        <Button
          onClick={handleShowForm}
          icon="Plus"
          variant="primary"
        >
          Add Custom Field
        </Button>
      </div>

      {/* Custom Field Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-surface-900">
              {editingField ? 'Edit Custom Field' : 'Add Custom Field'}
            </h2>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
              icon="X"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Field Label"
                name="label"
                value={formData.label}
                onChange={handleFormChange}
                placeholder="e.g., Company Size"
                required
              />

              <Select
                label="Field Type"
                name="type"
                value={formData.type}
                onChange={handleFormChange}
                options={typeOptions}
              />

              <Select
                label="Entity"
                name="entity"
                value={formData.entity}
                onChange={handleFormChange}
                options={entityOptions}
              />

              <Input
                label="Placeholder Text"
                name="placeholder"
                value={formData.placeholder}
                onChange={handleFormChange}
                placeholder="e.g., Select company size"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="required"
                type="checkbox"
                name="required"
                checked={formData.required}
                onChange={handleFormChange}
                className="w-4 h-4 text-primary-600 bg-surface-100 border-surface-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="required" className="text-sm font-medium text-surface-700">
                Required field
              </label>
            </div>

            {/* Options for select fields */}
            {formData.type === 'select' && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-surface-700">
                  Options
                </label>
                
                <div className="flex space-x-2">
                  <Input
                    value={optionInput}
                    onChange={(e) => setOptionInput(e.target.value)}
                    placeholder="Enter option"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={addOption}
                    icon="Plus"
                  >
                    Add
                  </Button>
                </div>

                {formData.options.length > 0 && (
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center justify-between bg-surface-50 px-3 py-2 rounded-lg">
                        <span className="text-sm text-surface-900">{option}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          icon="X"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                loading={formLoading}
                icon={editingField ? "Save" : "Plus"}
              >
                {editingField ? 'Update Field' : 'Create Field'}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Fields List */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <Empty
            type="custom-fields"
            onAction={handleShowForm}
            className="py-12"
          />
        ) : (
          <div className="grid gap-4">
            {fields.map((field, index) => (
              <motion.div
                key={field.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name={getTypeIcon(field.type)} className="w-5 h-5 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-surface-900">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-600">
                        <span className="capitalize">{field.type}</span>
                        <span>•</span>
                        <span className="capitalize">{field.entity}</span>
                        {field.placeholder && (
                          <>
                            <span>•</span>
                            <span>{field.placeholder}</span>
                          </>
                        )}
                      </div>
                      {field.options && field.options.length > 0 && (
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            {field.options.slice(0, 3).map((option, i) => (
                              <span key={i} className="px-2 py-1 bg-surface-100 text-surface-700 text-xs rounded">
                                {option}
                              </span>
                            ))}
                            {field.options.length > 3 && (
                              <span className="px-2 py-1 bg-surface-100 text-surface-700 text-xs rounded">
                                +{field.options.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditField(field)}
                      icon="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteField(field.Id)}
                      icon="Trash2"
                      className="text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default CustomFields