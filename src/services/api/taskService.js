class TaskService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
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
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "dueDate" } },
          { field: { Name: "status" } },
          { field: { Name: "priority" } },
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
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          Name: taskData.title,
          title: taskData.title,
          description: taskData.description || null,
          dueDate: taskData.dueDate || null,
          status: taskData.status,
          priority: taskData.priority,
          contactId: taskData.contactId || null,
          dealId: taskData.dealId || null,
          Tags: taskData.Tags || null
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
          console.error(`Failed to create ${failedRecords.length} tasks:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create task');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating task:", error);
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
      if (updateData.description !== undefined) updateRecord.description = updateData.description;
      if (updateData.dueDate !== undefined) updateRecord.dueDate = updateData.dueDate;
      if (updateData.status !== undefined) updateRecord.status = updateData.status;
      if (updateData.priority !== undefined) updateRecord.priority = updateData.priority;
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
          console.error(`Failed to update ${failedUpdates.length} tasks:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update task');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating task:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} tasks:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete task');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService()