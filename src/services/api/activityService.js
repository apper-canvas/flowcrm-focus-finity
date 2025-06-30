import { activityData } from '@/services/mockData/activities.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ActivityService {
  constructor() {
    this.activities = [...activityData]
  }

  async getAll() {
    await delay(300)
    return [...this.activities]
  }

  async getById(id) {
    await delay(200)
    return this.activities.find(activity => activity.Id === id) || null
  }

  async create(activityData) {
    await delay(400)
    
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id), 0) + 1,
      ...activityData,
      timestamp: activityData.timestamp || new Date().toISOString()
    }
    
    this.activities.push(newActivity)
    return { ...newActivity }
  }

  async update(id, updateData) {
    await delay(350)
    
    const index = this.activities.findIndex(activity => activity.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    
    this.activities[index] = { ...this.activities[index], ...updateData }
    return { ...this.activities[index] }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.activities.findIndex(activity => activity.Id === id)
    if (index === -1) {
      throw new Error('Activity not found')
    }
    
    this.activities.splice(index, 1)
    return true
  }
}

export const activityService = new ActivityService()