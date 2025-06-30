import { taskData } from '@/services/mockData/tasks.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...taskData]
  }

  async getAll() {
    await delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await delay(200)
    return this.tasks.find(task => task.Id === id) || null
  }

  async create(taskData) {
    await delay(400)
    
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      createdAt: new Date().toISOString()
    }
    
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updateData) {
    await delay(350)
    
    const index = this.tasks.findIndex(task => task.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updateData }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.tasks.findIndex(task => task.Id === id)
    if (index === -1) {
      throw new Error('Task not found')
    }
    
    this.tasks.splice(index, 1)
    return true
  }
}

export const taskService = new TaskService()