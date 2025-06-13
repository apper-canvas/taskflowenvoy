import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  icon,
  color,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-gray-700 text-gray-300',
    primary: 'bg-primary/20 text-primary border border-primary/30',
    secondary: 'bg-secondary/20 text-secondary border border-secondary/30',
    accent: 'bg-accent/20 text-accent border border-accent/30',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30'
  }
  
  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }

  const customStyle = color ? {
    backgroundColor: `${color}20`,
    color: color,
    borderColor: `${color}30`,
    border: '1px solid'
  } : {}

  return (
    <span
      className={`${baseClasses} ${color ? '' : variants[variant]} ${sizes[size]} ${className}`}
      style={customStyle}
      {...props}
    >
      {icon && (
        <ApperIcon name={icon} size={12} className="mr-1.5" />
      )}
      {children}
    </span>
  )
}

export default Badge