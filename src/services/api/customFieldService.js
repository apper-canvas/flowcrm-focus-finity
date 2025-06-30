import mockData from '@/services/mockData/customFields.json'

class CustomFieldService {
  constructor() {
    this.fields = [...mockData]
    this.lastId = Math.max(...this.fields.map(field => field.Id), 0)
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...this.fields]
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const field = this.fields.find(f => f.Id === parseInt(id))
    if (!field) {
      throw new Error('Custom field not found')
    }
    return { ...field }
  }

  async getByEntity(entity) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.fields.filter(field => field.entity === entity).map(field => ({ ...field }))
  }

  async create(fieldData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newField = {
      Id: ++this.lastId,
      ...fieldData,
      createdAt: new Date().toISOString()
    }
    
    this.fields.push(newField)
    return { ...newField }
  }

  async update(id, fieldData) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.fields.findIndex(f => f.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Custom field not found')
    }
    
    this.fields[index] = {
      ...this.fields[index],
      ...fieldData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    }
    
    return { ...this.fields[index] }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.fields.findIndex(f => f.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Custom field not found')
    }
    
    this.fields.splice(index, 1)
    return true
  }
}

export const customFieldService = new CustomFieldService()