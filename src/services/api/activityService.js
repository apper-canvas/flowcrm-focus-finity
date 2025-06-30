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
      // Ensure proper data formatting for Apper backend
      const formattedTimestamp = activityData.timestamp 
        ? new Date(activityData.timestamp).toISOString()
        : new Date().toISOString();
      
      const params = {
        records: [{
          // CRITICAL: Only include Updateable fields as per Tables & Fields JSON
          Name: activityData.name || activityData.description || 'New Activity',
          type: activityData.type,
          description: activityData.description,
          timestamp: formattedTimestamp,
          // Convert lookup values to integers for proper database storage
          contactId: activityData.contactId ? parseInt(activityData.contactId) : null,
          dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
          Tags: activityData.Tags || null
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error('Activity creation failed:', response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} activities:${JSON.stringify(failedRecords)}`);
          
          // Log detailed error information for debugging
          failedRecords.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                console.error(`Field ${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) {
              console.error(`Record error: ${record.message}`);
            }
          });
          
          throw new Error('Failed to create activity - check console for details');
        }
        
        return successfulRecords[0]?.data;
      }
      
      throw new Error('No results returned from activity creation');
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