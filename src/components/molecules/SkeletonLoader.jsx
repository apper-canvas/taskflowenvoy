import React from 'react'
import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface rounded-lg p-4 border border-gray-700"
        >
          <div className="animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-gray-600 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="flex items-center space-x-3">
                  <div className="h-5 bg-gray-600 rounded-full w-16"></div>
                  <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                  <div className="h-4 bg-gray-600 rounded w-20"></div>
                </div>
              </div>
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader