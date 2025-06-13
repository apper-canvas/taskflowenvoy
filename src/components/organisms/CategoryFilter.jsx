import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import CategoryPill from '@/components/molecules/CategoryPill'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import { categoryService } from '@/services'

const CategoryFilter = ({ 
  selectedCategory, 
  onCategoryChange, 
  taskCounts = {},
  className = '' 
}) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await categoryService.getAll()
      setCategories(result)
    } catch (err) {
      setError(err.message || 'Failed to load categories')
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-600 rounded-full animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-error text-sm mb-2">{error}</p>
        <button 
          onClick={loadCategories}
          className="text-primary hover:text-primary/80 text-sm"
        >
          Try again
        </button>
      </div>
    )
  }

  const allCategory = {
    id: 'all',
    name: 'All Tasks',
    icon: 'CheckSquare',
    color: '#6366F1'
  }

  const categoryList = [allCategory, ...categories]

  return (
    <div className={`${className}`}>
      <motion.div 
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {categoryList.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <CategoryPill
              category={category}
              active={selectedCategory?.id === category.id}
              onClick={onCategoryChange}
              count={taskCounts[category.id] || 0}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default CategoryFilter