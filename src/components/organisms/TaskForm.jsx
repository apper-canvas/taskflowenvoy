import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import { taskService, categoryService } from '@/services'

const TaskForm = ({ onTaskCreated, className = '' }) => {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const result = await categoryService.getAll()
      setCategories(result)
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    setLoading(true)
    try {
      const newTask = await taskService.create({
        ...formData,
        title: formData.title.trim()
      })
      
      setFormData({
        title: '',
        categoryId: '',
        priority: 'medium',
        dueDate: ''
      })
      setIsExpanded(false)
      
      onTaskCreated(newTask)
      toast.success('Task created successfully!')
    } catch (error) {
      toast.error('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const priorityOptions = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ]

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }))

  if (loadingCategories) {
    return (
      <div className="bg-surface rounded-lg p-4 border border-gray-700">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-600 rounded w-full"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      layout
      className={`bg-surface rounded-lg border border-gray-700 overflow-hidden ${className}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-4">
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={isExpanded ? "What needs to be done?" : "Add a new task..."}
            onFocus={() => setIsExpanded(true)}
            icon="Plus"
            className="text-base"
          />
        </div>

        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="px-4 pb-4 space-y-4 border-t border-gray-700 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                options={categoryOptions}
                placeholder="Select category"
                label="Category"
              />

              <Select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                options={priorityOptions}
                label="Priority"
              />
            </div>

            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              label="Due Date"
              min={new Date().toISOString().split('T')[0]}
            />

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsExpanded(false)
                  setFormData({
                    title: '',
                    categoryId: '',
                    priority: 'medium',
                    dueDate: ''
                  })
                }}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                loading={loading}
                disabled={!formData.title.trim()}
                icon="Plus"
              >
                Add Task
              </Button>
            </div>
          </div>
        </motion.div>
      </form>
    </motion.div>
  )
}

export default TaskForm