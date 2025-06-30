class CustomFieldService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'custom_field';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "label" } },
          { field: { Name: "type" } },
          { field: { Name: "entity" } },
          { field: { Name: "required" } },
          { field: { Name: "placeholder" } },
          { field: { Name: "options" } },
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
      console.error("Error fetching custom fields:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "label" } },
          { field: { Name: "type" } },
          { field: { Name: "entity" } },
          { field: { Name: "required" } },
          { field: { Name: "placeholder" } },
          { field: { Name: "options" } },
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
      console.error(`Error fetching custom field with ID ${id}:`, error);
      return null;
    }
  }

  async getByEntity(entity) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "label" } },
          { field: { Name: "type" } },
          { field: { Name: "entity" } },
          { field: { Name: "required" } },
          { field: { Name: "placeholder" } },
          { field: { Name: "options" } },
          { field: { Name: "Tags" } },
          { field: { Name: "CreatedOn" } }
        ],
        where: [
          {
            FieldName: "entity",
            Operator: "EqualTo",
            Values: [entity]
          }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "ASC" }],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching custom fields by entity:", error);
      throw error;
    }
  }

  async create(fieldData) {
    try {
      const params = {
        records: [{
Name: fieldData.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
          label: fieldData.label,
          type: fieldData.type,
          entity: fieldData.entity,
          required: fieldData.required || false,
          placeholder: fieldData.placeholder || null,
          options: fieldData.options ? fieldData.options.join(',') : null,
          Tags: fieldData.Tags || null
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
          console.error(`Failed to create ${failedRecords.length} custom fields:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create custom field');
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      console.error("Error creating custom field:", error);
      throw error;
    }
  }

  async update(id, fieldData) {
    try {
      const updateRecord = { Id: parseInt(id) };
      
      if (fieldData.label !== undefined) {
        updateRecord.Name = fieldData.label;
updateRecord.label = fieldData.label;
        updateRecord.Name = fieldData.label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      }
      if (fieldData.type !== undefined) updateRecord.type = fieldData.type;
      if (fieldData.entity !== undefined) updateRecord.entity = fieldData.entity;
      if (fieldData.required !== undefined) updateRecord.required = fieldData.required;
      if (fieldData.placeholder !== undefined) updateRecord.placeholder = fieldData.placeholder;
      if (fieldData.options !== undefined) {
        updateRecord.options = Array.isArray(fieldData.options) ? fieldData.options.join(',') : fieldData.options;
      }
      if (fieldData.Tags !== undefined) updateRecord.Tags = fieldData.Tags;

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
          console.error(`Failed to update ${failedUpdates.length} custom fields:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update custom field');
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      console.error("Error updating custom field:", error);
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
          console.error(`Failed to delete ${failedDeletions.length} custom fields:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete custom field');
        }
        
        return true;
      }
    } catch (error) {
      console.error("Error deleting custom field:", error);
      throw error;
    }
}
}

export { customFieldService };
export const customFieldService = new CustomFieldService()