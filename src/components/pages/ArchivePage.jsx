import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import TaskList from '@/components/organisms/TaskList'
import CategoryFilter from '@/components/organisms/CategoryFilter'
import SearchBar from '@/components/molecules/SearchBar'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { taskService, categoryService } from '@/services'

const ArchivePage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getArchived(),
        categoryService.getAll()
      ])
      setTasks(tasksResult)
      setCategories(categoriesResult)
    } catch (err) {
      setError(err.message || 'Failed to load archived tasks')
      toast.error('Failed to load archived tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskRestore = async (task) => {
    try {
      const restoredTask = await taskService.update(task.id, {
        archived: false,
        completed: false
      })
      setTasks(prev => prev.filter(t => t.id !== task.id))
      toast.success('Task restored successfully!')
    } catch (error) {
      toast.error('Failed to restore task')
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    if (!updatedTask.archived) {
      // Task was restored, remove from archive
      setTasks(prev => prev.filter(task => task.id !== updatedTask.id))
    } else {
      // Task was updated but still archived
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ))
    }
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

  const handleClearArchive = async () => {
    if (tasks.length === 0) return
    
    if (!confirm(`Are you sure you want to permanently delete all ${tasks.length} archived tasks? This action cannot be undone.`)) {
      return
    }

    try {
      const taskIds = tasks.map(task => task.id)
      await taskService.bulkDelete(taskIds)
      setTasks([])
      toast.success('Archive cleared successfully')
    } catch (error) {
      toast.error('Failed to clear archive')
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

    // Sort by completion date (most recent first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="h-8 bg-gray-600 rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-600 rounded w-96 animate-pulse"></div>
        </div>
        <SkeletonLoader count={5} />
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Archived Tasks
            </h1>
            <p className="text-gray-400">
              {tasks.length} completed task{tasks.length !== 1 ? 's' : ''} in archive
            </p>
          </div>
          
          {tasks.length > 0 && (
            <Button
              variant="danger"
              onClick={handleClearArchive}
              icon="Trash2"
            >
              Clear Archive
            </Button>
          )}
        </div>
      </div>

      {tasks.length > 0 && (
        <>
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <SearchBar 
              onSearch={setSearchQuery}
              placeholder="Search archived tasks..."
            />
            
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              taskCounts={taskCounts}
            />
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            emptyStateProps={{
              title: searchQuery || selectedCategory 
                ? "No matching archived tasks" 
                : "No archived tasks",
              description: searchQuery || selectedCategory
                ? "Try adjusting your search or filter criteria"
                : "Completed tasks will appear here",
              icon: "Archive"
            }}
          />
        </>
      )}

      {tasks.length === 0 && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="mb-6"
          >
            <ApperIcon name="Archive" size={64} className="text-gray-600 mx-auto" />
          </motion.div>
          
          <h3 className="text-xl font-display font-semibold text-white mb-2">
            No archived tasks yet
          </h3>
          
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            When you complete tasks, they'll be automatically archived here for future reference.
          </p>
          
          <Button 
            onClick={() => window.history.back()} 
            variant="secondary"
            icon="ArrowLeft"
          >
            Back to Tasks
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ArchivePage