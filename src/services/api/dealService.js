import { dealData } from '@/services/mockData/deals.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class DealService {
  constructor() {
    this.deals = [...dealData]
  }

  async getAll() {
    await delay(300)
    return [...this.deals]
  }

  async getById(id) {
    await delay(200)
    return this.deals.find(deal => deal.Id === id) || null
  }

  async create(dealData) {
    await delay(400)
    
    const newDeal = {
      Id: Math.max(...this.deals.map(d => d.Id), 0) + 1,
      ...dealData,
      createdAt: new Date().toISOString()
    }
    
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, updateData) {
    await delay(350)
    
    const index = this.deals.findIndex(deal => deal.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    this.deals[index] = { ...this.deals[index], ...updateData }
    return { ...this.deals[index] }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.deals.findIndex(deal => deal.Id === id)
    if (index === -1) {
      throw new Error('Deal not found')
    }
    
    this.deals.splice(index, 1)
    return true
  }
}

export const dealService = new DealService()