import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import DealCard from '@/components/molecules/DealCard'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import Empty from '@/components/ui/Empty'

const DealPipeline = ({ deals = [], contacts = [], onUpdateDeal, onCreateDeal, onEditDeal }) => {
  const [draggedDeal, setDraggedDeal] = useState(null)

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-surface-500' },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-500' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-green-500' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-500' }
  ]

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage)
  }

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.Id === contactId)
  }

  const getStageValue = (stage) => {
    const stageDeals = getDealsByStage(stage)
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, newStage) => {
    e.preventDefault()
    
    if (!draggedDeal || draggedDeal.stage === newStage) {
      setDraggedDeal(null)
      return
    }

    try {
      await onUpdateDeal(draggedDeal.Id, { stage: newStage })
      toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name}`)
    } catch (error) {
      toast.error('Failed to update deal stage')
    }
    
    setDraggedDeal(null)
  }

  const handleDragEnd = () => {
    setDraggedDeal(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-surface-900">Sales Pipeline</h2>
        <Button
          onClick={onCreateDeal}
          icon="Plus"
          variant="primary"
        >
          New Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 min-h-[600px]">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id)
          const stageValue = getStageValue(stage.id)
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <h3 className="font-semibold text-surface-900">{stage.name}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-surface-500">
                    {stageDeals.length}
                  </span>
                  <span className="text-xs font-medium text-surface-600">
                    {formatCurrency(stageValue)}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {stageDeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <ApperIcon name="Target" className="w-8 h-8 text-surface-400 mb-2" />
                    <p className="text-sm text-surface-500">No deals in this stage</p>
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <motion.div
                      key={deal.Id}
                      layout
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-move ${draggedDeal?.Id === deal.Id ? 'opacity-50' : ''}`}
                    >
                      <DealCard
                        deal={deal}
                        contact={getContactById(deal.contactId)}
                        onEdit={onEditDeal}
                        className="transition-transform hover:scale-105"
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default DealPipeline