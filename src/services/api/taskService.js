const { ApperClient } = window.ApperSDK;

// Initialize ApperClient with Project ID and Public Key
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const taskService = {
  async getAll() {
    try {
      const params = {
        Fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'completed', 'priority', 'due_date', 'created_at', 'archived', 'category_id'],
        orderBy: [
          {
            FieldName: "created_at",
            SortType: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI format
      return response.data.map(task => ({
        id: task.Id,
        title: task.title,
        completed: task.completed,
        categoryId: task.category_id,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
        archived: task.archived
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'completed', 'priority', 'due_date', 'created_at', 'archived', 'category_id']
      };
      
      const response = await apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      if (!response.data) {
        return null;
      }
      
      // Map database fields to UI format
      const task = response.data;
      return {
        id: task.Id,
        title: task.title,
        completed: task.completed,
        categoryId: task.category_id,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
        archived: task.archived
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  },

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            title: taskData.title,
            completed: false,
            category_id: parseInt(taskData.categoryId) || null,
            priority: taskData.priority || 'medium',
            due_date: taskData.dueDate || null,
            created_at: new Date().toISOString(),
            archived: false
          }
        ]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error('Failed to create task');
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed,
            categoryId: task.category_id,
            priority: task.priority,
            dueDate: task.due_date,
            createdAt: task.created_at,
            archived: task.archived
          };
        }
      }
      
      throw new Error('No task created');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      // Map UI fields to database fields and only include updateable fields
      const updateData = {
        Id: id
      };
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
      if (updates.archived !== undefined) updateData.archived = updates.archived;
      if (updates.categoryId !== undefined) updateData.category_id = parseInt(updates.categoryId) || null;
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error('Failed to update task');
        }
        
        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed,
            categoryId: task.category_id,
            priority: task.priority,
            dueDate: task.due_date,
            createdAt: task.created_at,
            archived: task.archived
          };
        }
      }
      
      throw new Error('No task updated');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error('Failed to delete task');
        }
      }
      
      return { id };
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async getActive() {
    try {
      const params = {
        Fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'completed', 'priority', 'due_date', 'created_at', 'archived', 'category_id'],
        where: [
          {
            FieldName: "completed",
            Operator: "ExactMatch",
            Values: [false]
          },
          {
            FieldName: "archived",
            Operator: "ExactMatch",
            Values: [false]
          }
        ],
        orderBy: [
          {
            FieldName: "created_at",
            SortType: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data.map(task => ({
        id: task.Id,
        title: task.title,
        completed: task.completed,
        categoryId: task.category_id,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
        archived: task.archived
      }));
    } catch (error) {
      console.error("Error fetching active tasks:", error);
      throw error;
    }
  },

  async getArchived() {
    try {
      const params = {
        Fields: ['Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'completed', 'priority', 'due_date', 'created_at', 'archived', 'category_id'],
        where: [
          {
            FieldName: "archived",
            Operator: "ExactMatch",
            Values: [true]
          }
        ],
        orderBy: [
          {
            FieldName: "created_at",
            SortType: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data.map(task => ({
        id: task.Id,
        title: task.title,
        completed: task.completed,
        categoryId: task.category_id,
        priority: task.priority,
        dueDate: task.due_date,
        createdAt: task.created_at,
        archived: task.archived
      }));
    } catch (error) {
      console.error("Error fetching archived tasks:", error);
      throw error;
    }
  },

  async bulkUpdate(taskIds, updates) {
    try {
      const records = taskIds.map(id => {
        const updateData = { Id: id };
        
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.completed !== undefined) updateData.completed = updates.completed;
        if (updates.priority !== undefined) updateData.priority = updates.priority;
        if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate;
        if (updates.archived !== undefined) updateData.archived = updates.archived;
        if (updates.categoryId !== undefined) updateData.category_id = parseInt(updates.categoryId) || null;
        
        return updateData;
      });
      
      const params = { records };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }
        
        return successfulUpdates.map(result => {
          const task = result.data;
          return {
            id: task.Id,
            title: task.title,
            completed: task.completed,
            categoryId: task.category_id,
            priority: task.priority,
            dueDate: task.due_date,
            createdAt: task.created_at,
            archived: task.archived
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error("Error bulk updating tasks:", error);
      throw error;
    }
  },

  async bulkDelete(taskIds) {
    try {
      const params = {
        RecordIds: taskIds
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }
      }
      
      return taskIds.map(id => ({ id }));
    } catch (error) {
      console.error("Error bulk deleting tasks:", error);
      throw error;
    }
  }
};

export default taskService;