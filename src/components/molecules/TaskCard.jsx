import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isPast, parseISO } from 'date-fns'
import { toast } from 'react-toastify'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import PriorityIndicator from '@/components/molecules/PriorityIndicator'
import ApperIcon from '@/components/ApperIcon'
import { taskService, categoryService } from '@/services'

const TaskCard = ({ 
  task, 
  category, 
  onUpdate, 
  onDelete, 
  selectable = false,
  selected = false,
  onSelect,
  className = '' 
}) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleComplete = async () => {
    if (isCompleting) return
    
    setIsCompleting(true)
    try {
      const updatedTask = await taskService.update(task.id, {
        completed: !task.completed
      })
      onUpdate(updatedTask)
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task completed! 🎉')
    } catch (error) {
      toast.error('Failed to update task')
    } finally {
      setIsCompleting(false)
    }
  }

  const handleDelete = async () => {
    if (isDeleting) return
    
    setIsDeleting(true)
    try {
      await taskService.delete(task.id)
      onDelete(task.id)
      toast.success('Task deleted')
    } catch (error) {
      toast.error('Failed to delete task')
    } finally {
      setIsDeleting(false)
    }
  }

  const isOverdue = task.dueDate && isPast(parseISO(task.dueDate)) && !task.completed
  const isDueToday = task.dueDate && isToday(parseISO(task.dueDate))

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`
        bg-surface rounded-lg p-4 border border-gray-700
        hover:border-gray-600 transition-all duration-200
        ${task.completed ? 'opacity-75' : ''}
        ${selected ? 'ring-2 ring-primary/50 border-primary/50' : ''}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {selectable && (
            <Checkbox
              checked={selected}
              onChange={() => onSelect(task.id)}
              className="mt-0.5"
            />
          )}
          
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isCompleting}
            className="mt-0.5"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium break-words ${
              task.completed ? 'line-through text-gray-500' : 'text-white'
            }`}>
              {task.title}
            </h3>
            
            <div className="flex items-center space-x-3 mt-2">
              {category && (
                <Badge
                  icon={category.icon}
                  color={category.color}
                  size="xs"
                >
                  {category.name}
                </Badge>
              )}
              
              <PriorityIndicator priority={task.priority} size="sm" />
              
              {task.dueDate && (
                <div className={`flex items-center text-xs ${
                  isOverdue ? 'text-error' : isDueToday ? 'text-warning' : 'text-gray-400'
                }`}>
                  <ApperIcon name="Calendar" size={12} className="mr-1" />
                  {format(parseISO(task.dueDate), 'MMM dd')}
                  {isOverdue && (
                    <span className="ml-1 font-medium">Overdue</span>
                  )}
                  {isDueToday && (
                    <span className="ml-1 font-medium">Today</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1 text-gray-400 hover:text-error transition-colors"
        >
          {isDeleting ? (
            <ApperIcon name="Loader2" size={16} className="animate-spin" />
          ) : (
            <ApperIcon name="Trash2" size={16} />
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default TaskCard