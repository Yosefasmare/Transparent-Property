import useStore from '@/lib/store'
import React from 'react'
import { HiOutlineUserGroup } from 'react-icons/hi'
import { TiMessages } from 'react-icons/ti'

const RecentInquiries = () => {

  const {agent_inquiries} = useStore()

  const recentInquiries = agent_inquiries.slice(0, 3);

  return (
    <div className="space-y-4">
              {recentInquiries.length > 0 ? (
                recentInquiries.map((inquiry, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <HiOutlineUserGroup className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{inquiry.name || `Inquiry ${index + 1}`}</h4>
                        <p className="text-sm text-gray-600">{inquiry.email || 'email@example.com'}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {inquiry.message || 'Interested in your property listing...'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TiMessages className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No inquiries yet</p>
                </div>
              )}
            </div>
  )
}

export default RecentInquiries