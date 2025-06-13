import React, { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({ 
  label,
  error,
  icon,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} size={16} className="text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            block w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg
            text-white placeholder-gray-400
            focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-error focus:border-error focus:ring-error' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input