import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ContactForm = ({ contact = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    position: contact?.position || '',
    tags: contact?.tags ? contact.tags.join(', ') : ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

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