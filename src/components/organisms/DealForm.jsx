import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'

const DealForm = ({ deal = null, contacts = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    value: deal?.value || '',
    stage: deal?.stage || 'lead',
    contactId: deal?.contactId || '',
    probability: deal?.probability || 25,
    expectedCloseDate: deal?.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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
    label: `${contact.name} - ${contact.company}`
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
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
    </motion.div>
  )
}

export default DealForm