import taskData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let tasks = [...taskData]

const taskService = {
  async getAll() {
    await delay(300)
    return [...tasks]
  },

  async getById(id) {
    await delay(200)
    const task = tasks.find(t => t.id === id)
    return task ? { ...task } : null
  },

  async create(taskData) {
    await delay(300)
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      completed: false,
      categoryId: taskData.categoryId,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString(),
      archived: false
    }
    tasks.push(newTask)
    return { ...newTask }
  },

  async update(id, updates) {
    await delay(250)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    tasks[index] = { ...tasks[index], ...updates }
    return { ...tasks[index] }
  },

  async delete(id) {
    await delay(200)
    const index = tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    const deletedTask = tasks[index]
    tasks = tasks.filter(t => t.id !== id)
    return { ...deletedTask }
  },

  async getActive() {
    await delay(250)
    return tasks.filter(t => !t.completed && !t.archived).map(t => ({ ...t }))
  },

  async getArchived() {
    await delay(300)
    return tasks.filter(t => t.archived).map(t => ({ ...t }))
  },

  async bulkUpdate(taskIds, updates) {
    await delay(400)
    const updatedTasks = []
    
    taskIds.forEach(id => {
      const index = tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...updates }
        updatedTasks.push({ ...tasks[index] })
      }
    })
    
    return updatedTasks
  },

  async bulkDelete(taskIds) {
    await delay(350)
    const deletedTasks = []
    
    taskIds.forEach(id => {
      const index = tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        deletedTasks.push({ ...tasks[index] })
      }
    })
    
    tasks = tasks.filter(t => !taskIds.includes(t.id))
    return deletedTasks
  }
}

export default taskService