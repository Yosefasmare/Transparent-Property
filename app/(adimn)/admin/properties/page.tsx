import React from 'react'
import PropertiesManager from '@/components/admin/properties/PropertiesManager'

export default function PropertiesPage() {
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Properties</h1>
          <p className="mt-2 text-gray-600">View and manage all your real estate properties</p>
        </div>

        {/* Properties Manager Component */}
        <PropertiesManager />
      </div>
    </div>
  )
}