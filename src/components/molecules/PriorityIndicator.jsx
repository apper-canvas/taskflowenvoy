import React from 'react'
import { motion } from 'framer-motion'

const PriorityIndicator = ({ priority, size = 'md', showLabel = false, className = '' }) => {
  const priorities = {
    high: { color: '#EF4444', label: 'High' },
    medium: { color: '#F59E0B', label: 'Medium' },
    low: { color: '#10B981', label: 'Low' }
  }

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }

  const priorityConfig = priorities[priority] || priorities.medium

  return (
    <div className={`flex items-center ${className}`}>
      <motion.div
        className={`${sizes[size]} rounded-full pulse-gentle`}
        style={{ backgroundColor: priorityConfig.color }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
      {showLabel && (
        <span className="ml-2 text-xs font-medium text-gray-400 capitalize">
          {priorityConfig.label}
        </span>
      )}
    </div>
  )
}

export default PriorityIndicator