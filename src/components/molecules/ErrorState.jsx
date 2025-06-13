import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const ErrorState = ({ 
  message = "Something went wrong",
  onRetry,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="mb-6">
        <ApperIcon name="AlertCircle" size={64} className="text-error mx-auto" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-white mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-400 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="secondary" icon="RefreshCw">
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default ErrorState