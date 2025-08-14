'use client'

import { FiMessageSquare, FiPhone, FiMail } from 'react-icons/fi'

const InquiriesSummary = () => {
  const inquiries = [
    {
      id: 1,
      propertyTitle: 'Modern Downtown Apartment',
      name: 'Sarah Johnson',
      contact: 'sarah.j@email.com',
      date: '2024-01-15',
      type: 'email',
    },
    {
      id: 2,
      propertyTitle: 'Luxury Villa with Pool',
      name: 'Mike Chen',
      contact: '+1 (555) 123-4567',
      date: '2024-01-14',
      type: 'phone',
    },
    {
      id: 3,
      propertyTitle: 'Cozy Family Home',
      name: 'Emily Rodriguez',
      contact: 'emily.r@email.com',
      date: '2024-01-13',
      type: 'email',
    },
    {
      id: 4,
      propertyTitle: 'Investment Property',
      name: 'David Kim',
      contact: '+1 (555) 987-6543',
      date: '2024-01-12',
      type: 'phone',
    },
  ]

  const getContactIcon = (type: string) => {
    return type === 'email' ? FiMail : FiPhone
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Inquiries</h3>
          <div className="flex items-center text-sm text-gray-500">
            <FiMessageSquare className="mr-1 h-4 w-4" />
            <span>4 new</span>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {inquiries.map((inquiry) => {
          const ContactIcon = getContactIcon(inquiry.type)
          return (
            <div key={inquiry.id} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {inquiry.propertyTitle}
                  </p>
                  <p className="text-sm text-gray-600">{inquiry.name}</p>
                  <div className="flex items-center mt-1">
                    <ContactIcon className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500 truncate">{inquiry.contact}</span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <p className="text-xs text-gray-500">
                    {new Date(inquiry.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200">
        <a
          href="/admin/inquiries"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all inquiries →
        </a>
      </div>
    </div>
  )
}

export default InquiriesSummary 