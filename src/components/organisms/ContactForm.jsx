import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { customFieldService } from '@/services/api/customFieldService'
const ContactForm = ({ contact = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    position: contact?.position || '',
    tags: contact?.tags ? contact.tags.join(', ') : '',
    customFields: contact?.customFields || {}
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [customFields, setCustomFields] = useState([])

  useEffect(() => {
    loadCustomFields()
  }, [])

  const loadCustomFields = async () => {
    try {
      const fields = await customFieldService.getByEntity('contact')
      setCustomFields(fields)
    } catch (error) {
      console.error('Failed to load custom fields:', error)
    }
  }
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const contactData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }
      
      await onSubmit(contactData)
      toast.success(contact ? 'Contact updated successfully!' : 'Contact created successfully!')
    } catch (error) {
      toast.error('Failed to save contact')
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

  const handleCustomFieldChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldId]: value
      }
    }))
  }

  const renderCustomField = (field) => {
    const value = formData.customFields[field.Id] || ''
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            key={field.Id}
            label={field.label}
            name={`custom_${field.Id}`}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.Id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      case 'number':
        return (
          <Input
            key={field.Id}
            label={field.label}
            name={`custom_${field.Id}`}
            type="number"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.Id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      case 'select':
        return (
          <Select
            key={field.Id}
            label={field.label}
            name={`custom_${field.Id}`}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.Id, e.target.value)}
            options={field.options?.map(opt => ({ value: opt, label: opt })) || []}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      case 'checkbox':
        return (
          <div key={field.Id} className="flex items-center space-x-2">
            <input
              id={`custom_${field.Id}`}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleCustomFieldChange(field.Id, e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-surface-100 border-surface-300 rounded focus:ring-primary-500"
            />
            <label htmlFor={`custom_${field.Id}`} className="text-sm font-medium text-surface-700">
              {field.label}
            </label>
          </div>
        )
      case 'date':
        return (
          <Input
            key={field.Id}
            label={field.label}
            name={`custom_${field.Id}`}
            type="date"
            value={value}
            onChange={(e) => handleCustomFieldChange(field.Id, e.target.value)}
            required={field.required}
          />
        )
      default:
        return null
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
          {contact ? 'Edit Contact' : 'Add New Contact'}
        </h2>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          icon="X"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon="User"
            required
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon="Mail"
            required
          />
          
          <Input
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            icon="Phone"
          />
          
          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            icon="Building"
          />
          
          <Input
            label="Position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            icon="Briefcase"
          />
          
          <Input
            label="Tags (comma separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., lead, vip, prospect"
            icon="Tag"
          />
</div>

        {/* Custom Fields */}
        {customFields.length > 0 && (
          <div className="pt-6 border-t border-surface-200">
            <h3 className="text-lg font-medium text-surface-900 mb-4">Custom Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customFields.map(renderCustomField)}
            </div>
          </div>
        )}

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
            icon={contact ? "Save" : "Plus"}
          >
            {contact ? 'Update Contact' : 'Create Contact'}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}

export default ContactForm