import React, { forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  placeholder,
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
        <select
          ref={ref}
          className={`
            block w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg
            text-white
            focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20
            transition-all duration-200 appearance-none
            ${error ? 'border-error focus:border-error focus:ring-error' : ''}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-gray-400">
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value} className="bg-surface text-white">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-error">{error}</p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select