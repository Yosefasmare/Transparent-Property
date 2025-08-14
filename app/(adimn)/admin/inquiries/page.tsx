import InquiriesManager from '@/components/admin/inquiries/InquiriesManager'

export default function InquiriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Inquiries</h1>
          <p className="mt-2 text-gray-600">View and manage inquiries sent by users about properties.</p>
        </div>

        {/* Inquiries Manager Component */}
        <InquiriesManager />
      </div>
    </div>
  )
}