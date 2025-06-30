class ActivityService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_Activity';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } }
        ],
        orderBy: [{ fieldName: "timestamp", sorttype: "DESC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
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
      console.error(`Error fetching activity with ID ${id}:`, error);
      return null;
    }
  }

  async create(activityData) {
    try {
      const params = {
        records: [{
          Name: activityData.description,
          type: activityData.type,
          description: activityData.description,
          timestamp: activityData.timestamp || new Date().toISOString(),
          contactId: activityData.contactId || null,
          dealId: activityData.dealId || null,
          Tags: activityData.Tags || null
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
          console.error(`Failed to create ${failedRecords.length} activities:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create activity');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const updateRecord = { Id: parseInt(id) };
      
      if (updateData.description !== undefined) {
        updateRecord.Name = updateData.description;
        updateRecord.description = updateData.description;
      }
      if (updateData.type !== undefined) updateRecord.type = updateData.type;
      if (updateData.timestamp !== undefined) updateRecord.timestamp = updateData.timestamp;
      if (updateData.contactId !== undefined) updateRecord.contactId = updateData.contactId;
      if (updateData.dealId !== undefined) updateRecord.dealId = updateData.dealId;
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
          console.error(`Failed to update ${failedUpdates.length} activities:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update activity');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating activity:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} activities:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete activity');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }
  }
}

export const activityService = new ActivityService()