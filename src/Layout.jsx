import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { routeArray } from '@/config/routes'

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const currentRoute = routeArray.find(route => route.path === location.pathname) || routeArray[0]

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-dark">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-surface border-b border-gray-700 z-40">
        <div className="max-w-full px-6 h-full flex items-center justify-between overflow-hidden">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-white">TaskFlow</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 ml-8">
              {routeArray.map(route => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-primary text-white shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={16} />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-surface border-t border-gray-700 px-6 py-4 z-50"
          >
            <nav className="space-y-2">
              {routeArray.map(route => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-primary text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={16} />
                  <span>{route.label}</span>
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout