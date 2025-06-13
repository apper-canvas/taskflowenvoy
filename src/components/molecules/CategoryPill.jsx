import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryPill = ({ 
  category, 
  active = false, 
  onClick, 
  count,
  className = '' 
}) => {
  return (
    <motion.button
      onClick={() => onClick(category)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center px-4 py-2 rounded-full font-medium text-sm
        transition-all duration-200 border
        ${active 
          ? 'text-white border-transparent shadow-lg' 
          : 'text-gray-300 border-gray-600 hover:text-white hover:border-gray-500'
        }
        ${className}
      `}
      style={active ? {
        background: `linear-gradient(135deg, ${category.color}40, ${category.color}20)`,
        borderColor: `${category.color}60`
      } : {}}
    >
      <ApperIcon name={category.icon} size={14} className="mr-2" />
      <span>{category.name}</span>
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-white/20' : 'bg-gray-700'
        }`}>
          {count}
        </span>
      )}
    </motion.button>
  )
}

export default CategoryPill