import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const EmptyState = ({ 
  icon = "Package",
  title = "No items found",
  description = "Get started by creating your first item",
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="mb-6"
      >
        <ApperIcon name={icon} size={64} className="text-gray-600 mx-auto" />
      </motion.div>
      
      <h3 className="text-xl font-display font-semibold text-white mb-2">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} icon="Plus">
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default EmptyState