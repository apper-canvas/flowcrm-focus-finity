import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import { customFieldService } from '@/services/api/customFieldService'
const DealForm = ({ deal = null, contacts = [], onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    title: deal?.title || deal?.Name || '',
    value: deal?.value || '',
    stage: deal?.stage || 'lead',
    contactId: deal?.contactId || '',
    probability: deal?.probability || 25,
    expectedCloseDate: deal?.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : '',
    customFields: deal?.customFields || {}
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [customFields, setCustomFields] = useState([])

  useEffect(() => {
    loadCustomFields()
  }, [])

  const loadCustomFields = async () => {
    try {
      const fields = await customFieldService.getByEntity('deal')
      setCustomFields(fields)
    } catch (error) {
      console.error('Failed to load custom fields:', error)
    }
  }
  const stages = [
    { value: 'lead', label: 'Lead' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ]

const contactOptions = contacts.map(contact => ({
    value: contact.Id.toString(),
    label: `${contact.Name} - ${contact.company}`
  }))

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required'
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = 'Deal value must be greater than 0'
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        contactId: parseInt(formData.contactId),
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString() : null
      }
      
      await onSubmit(dealData)
      toast.success(deal ? 'Deal updated successfully!' : 'Deal created successfully!')
    } catch (error) {
      toast.error('Failed to save deal')
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
case 'select': {
        // Handle both string (database) and array (mock data) formats for options
        const optionsArray = Array.isArray(field.options) 
          ? field.options 
          : (typeof field.options === 'string' && field.options) 
            ? field.options.split(',').map(opt => opt.trim())
            : [];
            
        return (
          <Select
            key={field.Id}
            label={field.label}
            name={`custom_${field.Id}`}
            value={value}
            onChange={(e) => handleCustomFieldChange(field.Id, e.target.value)}
            options={optionsArray.map(opt => ({ value: opt, label: opt }))}
            placeholder={field.placeholder}
            required={field.required}
          />
        )
      }
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
    <div className="bg-white rounded-xl p-6 max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-surface-900">
          {deal ? 'Edit Deal' : 'Add New Deal'}
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
            label="Deal Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            icon="Target"
            required
          />
          
          <Input
            label="Deal Value"
            name="value"
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={handleChange}
            error={errors.value}
            icon="DollarSign"
            required
          />
          
          <Select
            label="Contact"
            name="contactId"
            value={formData.contactId}
            onChange={handleChange}
            options={contactOptions}
            error={errors.contactId}
            placeholder="Select a contact"
            required
          />
          
          <Select
            label="Stage"
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            options={stages}
          />
          
          <Input
            label="Probability (%)"
            name="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={handleChange}
            icon="Percent"
          />
          
          <Input
            label="Expected Close Date"
            name="expectedCloseDate"
            type="date"
            value={formData.expectedCloseDate}
            onChange={handleChange}
            icon="Calendar"
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
            icon={deal ? "Save" : "Plus"}
          >
            {deal ? 'Update Deal' : 'Create Deal'}
          </Button>
        </div>
      </form>
</div>
  )
}

export default DealForm