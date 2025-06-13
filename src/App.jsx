import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './Layout'
import { routeArray } from './config/routes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routeArray.map(route => (
            <Route 
              key={route.id}
              path={route.path}
              element={<route.component />}
/>
          ))}
          {(() => {
            const IndexComponent = routeArray[0].component;
            return <Route index element={<IndexComponent />} />;
          })()}
        </Route>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="z-[9999]"
        toastClassName="bg-surface text-white border border-gray-700"
        progressClassName="bg-gradient-primary"
      />
    </BrowserRouter>
  )
}

export default App