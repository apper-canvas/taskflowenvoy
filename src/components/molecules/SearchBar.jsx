import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search tasks...", 
  className = '',
  debounceMs = 300 
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, onSearch, debounceMs])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`relative transition-all duration-200 ${
          isFocused ? 'shadow-lg ring-2 ring-primary/20 rounded-lg' : ''
        }`}
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          icon="Search"
          className="pr-10"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </motion.div>
    </div>
  )
}

export default SearchBar