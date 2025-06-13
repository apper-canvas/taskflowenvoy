import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label, 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <motion.div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300
            ${checked 
              ? 'bg-gradient-primary border-primary shadow-lg' 
              : 'border-gray-500 hover:border-gray-400'
            }
          `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: checked ? 1 : 0, 
              opacity: checked ? 1 : 0 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20 
            }}
          >
            <ApperIcon name="Check" size={12} className="text-white" />
          </motion.div>
        </motion.div>
      </div>
      {label && (
        <span className="ml-3 text-sm text-gray-300">
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox