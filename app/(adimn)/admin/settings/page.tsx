import React from 'react'
import SettingsManager from '@/components/admin/SettingsManager'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account and dashboard preferences.</p>
        </div>

        {/* Settings Manager Component */}
        <SettingsManager />
      </div>
    </div>
  )
}