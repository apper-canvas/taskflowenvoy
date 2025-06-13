import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskForm from '@/components/organisms/TaskForm'
import TaskList from '@/components/organisms/TaskList'
import CategoryFilter from '@/components/organisms/CategoryFilter'
import SearchBar from '@/components/molecules/SearchBar'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { taskService, categoryService } from '@/services'

const TasksPage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getActive(),
        categoryService.getAll()
      ])
      setTasks(tasksResult)
      setCategories(categoriesResult)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev])
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
  }

  const handleCategoryChange = (category) => {
    if (category.id === 'all') {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(category)
    }
  }

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks]

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(task => task.categoryId === selectedCategory.id)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query)
      )
    }

    // Sort by priority and due date
    filtered.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      
      if (priorityDiff !== 0) return priorityDiff
      
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return filtered
  }, [tasks, selectedCategory, searchQuery])

  // Calculate task counts for categories
  const taskCounts = useMemo(() => {
    const counts = { all: tasks.length }
    
    categories.forEach(category => {
      counts[category.id] = tasks.filter(task => task.categoryId === category.id).length
    })
    
    return counts
  }, [tasks, categories])

  const activeTasksCount = tasks.filter(task => !task.completed).length
  const completedTodayCount = tasks.filter(task => {
    if (!task.completed || !task.dueDate) return false
    const today = new Date().toDateString()
    const taskDue = new Date(task.dueDate).toDateString()
    return today === taskDue
  }).length

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-600 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <SkeletonLoader count={5} />
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-64 bg-gray-600 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ErrorState message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 py-8"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          Your Tasks
        </h1>
        <p className="text-gray-400">
          {activeTasksCount} active task{activeTasksCount !== 1 ? 's' : ''} to complete
          {completedTodayCount > 0 && (
            <span className="ml-2 text-success">
              • {completedTodayCount} completed today
            </span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Form */}
          <TaskForm onTaskCreated={handleTaskCreated} />

          {/* Search and Filters */}
          <div className="space-y-4">
            <SearchBar 
              onSearch={setSearchQuery}
              placeholder="Search tasks..."
            />
            
            <div className="flex items-center justify-between">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                taskCounts={taskCounts}
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBulkActions(!showBulkActions)}
                icon={showBulkActions ? "X" : "CheckSquare"}
              >
                {showBulkActions ? 'Cancel' : 'Select'}
              </Button>
            </div>
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            showBulkActions={showBulkActions}
            emptyStateProps={{
              title: searchQuery || selectedCategory 
                ? "No matching tasks" 
                : "No tasks yet",
              description: searchQuery || selectedCategory
                ? "Try adjusting your search or filter criteria"
                : "Create your first task to get started with TaskFlow",
              actionLabel: (!searchQuery && !selectedCategory) ? "Create Task" : null,
              onAction: (!searchQuery && !selectedCategory) ? () => {
                document.querySelector('input[placeholder*="task"]')?.focus()
              } : null
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface rounded-lg p-6 border border-gray-700"
          >
            <h3 className="font-display font-semibold text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="CheckSquare" size={16} className="text-primary" />
                  <span className="text-gray-300">Active Tasks</span>
                </div>
                <span className="font-semibold text-white">{activeTasksCount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Calendar" size={16} className="text-warning" />
                  <span className="text-gray-300">Due Today</span>
                </div>
                <span className="font-semibold text-white">
                  {tasks.filter(task => {
                    if (!task.dueDate || task.completed) return false
                    const today = new Date().toDateString()
                    const taskDue = new Date(task.dueDate).toDateString()
                    return today === taskDue
                  }).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="AlertTriangle" size={16} className="text-error" />
                  <span className="text-gray-300">Overdue</span>
                </div>
                <span className="font-semibold text-white">
                  {tasks.filter(task => {
                    if (!task.dueDate || task.completed) return false
                    return new Date(task.dueDate) < new Date()
                  }).length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface rounded-lg p-6 border border-gray-700"
          >
            <h3 className="font-display font-semibold text-white mb-4">
              Categories
            </h3>
            <div className="space-y-3">
              {categories.map(category => (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-gray-300">{category.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {taskCounts[category.id] || 0}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default TasksPage