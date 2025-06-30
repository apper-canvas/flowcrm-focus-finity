import { contactData } from '@/services/mockData/contacts.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ContactService {
  constructor() {
    this.contacts = [...contactData]
  }

  async getAll() {
    await delay(300)
    return [...this.contacts]
  }

  async getById(id) {
    await delay(200)
    return this.contacts.find(contact => contact.Id === id) || null
  }

  async create(contactData) {
    await delay(400)
    
    const newContact = {
      Id: Math.max(...this.contacts.map(c => c.Id), 0) + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      lastContactedAt: null
    }
    
    this.contacts.push(newContact)
    return { ...newContact }
  }

  async update(id, updateData) {
    await delay(350)
    
    const index = this.contacts.findIndex(contact => contact.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    this.contacts[index] = { ...this.contacts[index], ...updateData }
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await delay(300)
    
    const index = this.contacts.findIndex(contact => contact.Id === id)
    if (index === -1) {
      throw new Error('Contact not found')
    }
    
    this.contacts.splice(index, 1)
    return true
  }
}

export const contactService = new ContactService()