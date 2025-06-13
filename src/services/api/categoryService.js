const { ApperClient } = window.ApperSDK;

// Initialize ApperClient with Project ID and Public Key
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const categoryService = {
  async getAll() {
    try {
      const params = {
        Fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'icon'],
        orderBy: [
          {
            FieldName: "Name",
            SortType: "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI format
      return response.data.map(category => ({
        id: category.Id,
        name: category.Name,
        color: category.color,
        icon: category.icon
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'icon']
      };
      
      const response = await apperClient.getRecordById('category', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (!response.data) {
        return null;
      }
      
      // Map database fields to UI format
      const category = response.data;
      return {
        id: category.Id,
        name: category.Name,
        color: category.color,
        icon: category.icon
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const params = {
        records: [
          {
            Name: categoryData.name,
            color: categoryData.color,
            icon: categoryData.icon
          }
        ]
      };
      
      const response = await apperClient.createRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create category');
        }
        
        if (successfulRecords.length > 0) {
          const category = successfulRecords[0].data;
          return {
            id: category.Id,
            name: category.Name,
            color: category.color,
            icon: category.icon
          };
        }
      }
      
      throw new Error('No category created');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      // Map UI fields to database fields and only include updateable fields
      const updateData = {
        Id: id
      };
      
      if (updates.name !== undefined) updateData.Name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update category');
        }
        
        if (successfulUpdates.length > 0) {
          const category = successfulUpdates[0].data;
          return {
            id: category.Id,
            name: category.Name,
            color: category.color,
            icon: category.icon
          };
        }
      }
      
      throw new Error('No category updated');
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('category', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete category');
        }
      }
      
      return { id };
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
};

export default categoryService;