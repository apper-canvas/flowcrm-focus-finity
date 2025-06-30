class DealService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedCloseDate" } },
          { field: { Name: "contactId" } },
          { field: { Name: "Tags" } },
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
      console.error("Error fetching deals:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedCloseDate" } },
          { field: { Name: "contactId" } },
          { field: { Name: "Tags" } },
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
      console.error(`Error fetching deal with ID ${id}:`, error);
      return null;
    }
  }

  async create(dealData) {
    try {
      const params = {
        records: [{
          Name: dealData.title,
          title: dealData.title,
          value: dealData.value,
          stage: dealData.stage,
          probability: dealData.probability,
          expectedCloseDate: dealData.expectedCloseDate,
          contactId: dealData.contactId,
          Tags: dealData.Tags || null
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
          console.error(`Failed to create ${failedRecords.length} deals:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create deal');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.title !== undefined) {
        updateRecord.Name = updateData.title;
        updateRecord.title = updateData.title;
      }
      if (updateData.value !== undefined) updateRecord.value = updateData.value;
      if (updateData.stage !== undefined) updateRecord.stage = updateData.stage;
      if (updateData.probability !== undefined) updateRecord.probability = updateData.probability;
      if (updateData.expectedCloseDate !== undefined) updateRecord.expectedCloseDate = updateData.expectedCloseDate;
      if (updateData.contactId !== undefined) updateRecord.contactId = updateData.contactId;
      if (updateData.Tags !== undefined) updateRecord.Tags = updateData.Tags;

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
          console.error(`Failed to update ${failedUpdates.length} deals:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update deal');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating deal:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} deals:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete deal');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
}

export const dealService = new DealService()