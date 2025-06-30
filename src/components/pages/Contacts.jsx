import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ContactCard from '@/components/molecules/ContactCard'
import ContactForm from '@/components/organisms/ContactForm'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { contactService } from '@/services/api/contactService'
import { activityService } from '@/services/api/activityService'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filterBy, setFilterBy] = useState('all')

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await contactService.getAll()
      setContacts(data)
    } catch (err) {
      setError('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply tag filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(contact =>
        contact.tags && contact.tags.includes(filterBy)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'company':
          return a.company.localeCompare(b.company)
case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'lastContacted': {
          const aDate = a.lastContactedAt ? new Date(a.lastContactedAt) : new Date(0)
          const bDate = b.lastContactedAt ? new Date(b.lastContactedAt) : new Date(0)
          return bDate - aDate
        }
        default:
          return 0
      }
    })

    return filtered
  }, [contacts, searchQuery, sortBy, filterBy])

  const handleCreateContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData)
      setContacts(prev => [...prev, newContact])
      setShowForm(false)
      
      // Log activity
      await activityService.create({
        type: 'contact',
        description: `Created new contact: ${newContact.name}`,
        contactId: newContact.Id,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      throw new Error('Failed to create contact')
    }
  }

  const handleEditContact = async (contactData) => {
    try {
      const updatedContact = await contactService.update(editingContact.Id, contactData)
      setContacts(prev => prev.map(contact => 
        contact.Id === editingContact.Id ? updatedContact : contact
      ))
      setEditingContact(null)
      setShowForm(false)
      
      // Log activity
      await activityService.create({
        type: 'contact',
        description: `Updated contact: ${updatedContact.name}`,
        contactId: updatedContact.Id,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      throw new Error('Failed to update contact')
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    try {
      await contactService.delete(contactId)
      setContacts(prev => prev.filter(contact => contact.Id !== contactId))
      toast.success('Contact deleted successfully')
    } catch (error) {
      toast.error('Failed to delete contact')
    }
  }

  const getAllTags = () => {
    const allTags = new Set()
    contacts.forEach(contact => {
      if (contact.tags) {
        contact.tags.forEach(tag => allTags.add(tag))
      }
    })
    return Array.from(allTags)
  }

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'company', label: 'Company' },
    { value: 'recent', label: 'Recently Added' },
    { value: 'lastContacted', label: 'Last Contacted' }
  ]

  const filterOptions = [
    { value: 'all', label: 'All Contacts' },
    ...getAllTags().map(tag => ({ value: tag, label: tag }))
  ]

  if (loading) {
    return <Loading type="contacts" />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadContacts}
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
          <h1 className="text-3xl font-bold text-surface-900">Contacts</h1>
          <p className="text-surface-600 mt-1">
            Manage your customer relationships and contact information
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          icon="Plus"
          variant="primary"
        >
          Add Contact
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search contacts..."
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Users" className="w-8 h-8 text-primary-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{contacts.length}</p>
              <p className="text-sm text-surface-600">Total Contacts</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Building" className="w-8 h-8 text-secondary-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">
                {new Set(contacts.map(c => c.company)).size}
              </p>
              <p className="text-sm text-surface-600">Companies</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Tag" className="w-8 h-8 text-accent-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{getAllTags().length}</p>
              <p className="text-sm text-surface-600">Tags</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Search" className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold text-surface-900">{filteredAndSortedContacts.length}</p>
              <p className="text-sm text-surface-600">Filtered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      {showForm && (
        <ContactForm
          contact={editingContact}
          onSubmit={editingContact ? handleEditContact : handleCreateContact}
          onCancel={() => {
            setShowForm(false)
            setEditingContact(null)
          }}
        />
      )}

      {/* Contact List */}
      <div className="space-y-4">
        {filteredAndSortedContacts.length === 0 ? (
          <Empty
            type={searchQuery ? "search" : "contacts"}
            onAction={searchQuery ? null : () => setShowForm(true)}
            className="py-12"
          />
        ) : (
          filteredAndSortedContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ContactCard contact={contact} />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}

export default Contacts