import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DealPipeline from '@/components/organisms/DealPipeline'
import DealForm from '@/components/organisms/DealForm'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'
import { activityService } from '@/services/api/activityService'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load deals data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDeal = async (dealData) => {
    try {
      const newDeal = await dealService.create(dealData)
      setDeals(prev => [...prev, newDeal])
      setShowForm(false)
      
      // Log activity
      await activityService.create({
        type: 'deal',
        description: `Created new deal: ${newDeal.title}`,
        contactId: newDeal.contactId,
        dealId: newDeal.Id,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      throw new Error('Failed to create deal')
    }
  }

  const handleEditDeal = async (dealData) => {
    try {
      const updatedDeal = await dealService.update(editingDeal.Id, dealData)
      setDeals(prev => prev.map(deal => 
        deal.Id === editingDeal.Id ? updatedDeal : deal
      ))
      setEditingDeal(null)
      setShowForm(false)
      
      // Log activity
      await activityService.create({
        type: 'deal',
        description: `Updated deal: ${updatedDeal.title}`,
        contactId: updatedDeal.contactId,
        dealId: updatedDeal.Id,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      throw new Error('Failed to update deal')
    }
  }

  const handleUpdateDeal = async (dealId, updateData) => {
    try {
      const updatedDeal = await dealService.update(dealId, updateData)
      setDeals(prev => prev.map(deal => 
        deal.Id === dealId ? updatedDeal : deal
      ))
      
      // Log stage change activity
      if (updateData.stage) {
        await activityService.create({
          type: 'deal',
          description: `Moved deal to ${updateData.stage}: ${updatedDeal.title}`,
          contactId: updatedDeal.contactId,
          dealId: updatedDeal.Id,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      throw new Error('Failed to update deal')
    }
  }

  const handleShowForm = () => {
    setEditingDeal(null)
    setShowForm(true)
  }

  const handleEditDealClick = (deal) => {
    setEditingDeal(deal)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingDeal(null)
  }

  if (loading) {
    return <Loading type="deals" />
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
      {/* Deal Form */}
      {showForm && (
        <DealForm
          deal={editingDeal}
          contacts={contacts}
          onSubmit={editingDeal ? handleEditDeal : handleCreateDeal}
          onCancel={handleCloseForm}
        />
      )}

      {/* Deal Pipeline */}
      <DealPipeline
        deals={deals}
        contacts={contacts}
        onCreateDeal={handleShowForm}
        onEditDeal={handleEditDealClick}
        onUpdateDeal={handleUpdateDeal}
      />
    </motion.div>
  )
}

export default Deals