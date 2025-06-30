class ContactService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_contact';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "position" } },
          { field: { Name: "Tags" } },
          { field: { Name: "lastContactedAt" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email" } },
          { field: { Name: "phone" } },
          { field: { Name: "company" } },
          { field: { Name: "position" } },
          { field: { Name: "Tags" } },
          { field: { Name: "lastContactedAt" } },
          { field: { Name: "CreatedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      return null;
    }
  }

  async create(contactData) {
    try {
      const params = {
        records: [{
          Name: contactData.name,
          email: contactData.email,
          phone: contactData.phone || null,
          company: contactData.company || null,
          position: contactData.position || null,
          Tags: contactData.tags ? contactData.tags.join(',') : null,
          lastContactedAt: contactData.lastContactedAt || null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} contacts:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create contact');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.name !== undefined) updateRecord.Name = updateData.name;
      if (updateData.email !== undefined) updateRecord.email = updateData.email;
      if (updateData.phone !== undefined) updateRecord.phone = updateData.phone;
      if (updateData.company !== undefined) updateRecord.company = updateData.company;
      if (updateData.position !== undefined) updateRecord.position = updateData.position;
      if (updateData.tags !== undefined) {
        updateRecord.Tags = Array.isArray(updateData.tags) ? updateData.tags.join(',') : updateData.tags;
      }
      if (updateData.lastContactedAt !== undefined) updateRecord.lastContactedAt = updateData.lastContactedAt;

      const params = { records: [updateRecord] };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} contacts:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update contact');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = { RecordIds: [parseInt(id)] };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} contacts:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete contact');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
}

export const contactService = new ContactService()
export const contactService = new ContactService()