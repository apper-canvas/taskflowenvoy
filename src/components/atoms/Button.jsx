import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  loading = false, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark'
  
  const variants = {
    primary: 'bg-gradient-primary text-white hover:shadow-lg focus:ring-primary disabled:opacity-50',
    secondary: 'bg-surface text-white border border-gray-600 hover:bg-gray-700 focus:ring-secondary',
    ghost: 'text-gray-300 hover:text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-error text-white hover:bg-red-600 focus:ring-error'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
        isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
      )}
      {!loading && icon && (
        <ApperIcon name={icon} size={16} className="mr-2" />
      )}
      {children}
    </motion.button>
  )
}

export default Button