import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/molecules/TaskCard'
import EmptyState from '@/components/molecules/EmptyState'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'
import { taskService } from '@/services'

const TaskList = ({ 
  tasks = [], 
  categories = [],
  onTaskUpdate, 
  onTaskDelete,
  showBulkActions = false,
  emptyStateProps = {},
  className = '' 
}) => {
  const [selectedTasks, setSelectedTasks] = useState([])
  const [bulkLoading, setBulkLoading] = useState(false)

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([])
    } else {
      setSelectedTasks(tasks.map(task => task.id))
    }
  }

  const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return
    
    setBulkLoading(true)
    try {
      const updatedTasks = await taskService.bulkUpdate(selectedTasks, { completed: true })
      updatedTasks.forEach(task => onTaskUpdate(task))
      setSelectedTasks([])
      toast.success(`${updatedTasks.length} tasks completed!`)
    } catch (error) {
      toast.error('Failed to complete selected tasks')
    } finally {
      setBulkLoading(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return
    
    setBulkLoading(true)
    try {
      await taskService.bulkDelete(selectedTasks)
      selectedTasks.forEach(taskId => onTaskDelete(taskId))
      setSelectedTasks([])
      toast.success(`${selectedTasks.length} tasks deleted`)
    } catch (error) {
      toast.error('Failed to delete selected tasks')
    } finally {
      setBulkLoading(false)
    }
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="CheckSquare"
        title="No tasks found"
        description="Create your first task to get started with TaskFlow"
        {...emptyStateProps}
        className={className}
      />
    )
  }

  return (
    <div className={className}>
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {showBulkActions && selectedTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface rounded-lg p-4 mb-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedTasks.length === tasks.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBulkComplete}
                  loading={bulkLoading}
                  icon="Check"
                >
                  Complete
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  loading={bulkLoading}
                  icon="Trash2"
                >
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <motion.div 
        className="space-y-3"
        layout
      >
        <AnimatePresence mode="popLayout">
          {tasks.map((task, index) => {
            const category = categories.find(cat => cat.id === task.categoryId)
            
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  delay: index * 0.05,
                  layout: { duration: 0.3 }
                }}
              >
                <TaskCard
                  task={task}
                  category={category}
                  onUpdate={onTaskUpdate}
                  onDelete={onTaskDelete}
                  selectable={showBulkActions}
                  selected={selectedTasks.includes(task.id)}
                  onSelect={handleTaskSelect}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default TaskList