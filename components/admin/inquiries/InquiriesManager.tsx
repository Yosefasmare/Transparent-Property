'use client'

import useStore from '@/lib/store'
import { deleteInquiry } from '@/lib/supabaseClient'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaHouse } from 'react-icons/fa6'
import { FiSearch, FiMail, FiEye, FiTrash2, FiCalendar, FiUser } from 'react-icons/fi'



export default function InquiriesManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({})
  const { agent_inquiries,stateLoader,setAgent_inquiries } =  useStore()

  // Auto-hide message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
  }



  const filteredInquiries = stateLoader ? [] :  agent_inquiries.filter(inquiry => {
    const matchesSearch = inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email && inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch 
  })

  const handleDelete = async (id: string) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }))
    
    try {
      const {message,type} = await deleteInquiry(id)
      if(type === 'success') {
        setAgent_inquiries(agent_inquiries.filter(inquiry => inquiry.id !== id))
      }
      showMessage(type === 'success'? 'success' : 'error',message)
    } catch {
      showMessage('error', 'Failed to delete inquiry. Please try again.')
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMessagePreview = (message: string) => {
    return message.length > 80 ? message.substring(0, 80) + '...' : message
  }

  return (
    <>
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, email, or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
    
      </div>

      {/* Message Notification */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 shadow-lg animate-fade-in-down ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {message.type === 'success' ? (
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {message.type === 'success' ? 'Success!' : 'Error!'}
                </p>
                <p className="text-sm opacity-90">{message.text}</p>
              </div>
            </div>
            <button
              onClick={() => setMessage(null)}
              className={`p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                message.type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

    {stateLoader ? (
      <div className="flex flex-col items-center justify-center py-16">
        {/* Animated Loading Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
        
        {/* Loading Text with Typing Animation */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Inquiries</h3>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse" style={{width: '60%'}}></div>
        </div>
      </div>
    ) : (
    <>
        {/* Inquiries List */}
      {filteredInquiries.length > 0 ? (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div 
              key={inquiry.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              {/* Mobile Layout */}
              <div className="block sm:hidden">
                {/* Header with Image and Date */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 flex justify-center items-center bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <FaHouse className='h-4 w-4 text-indigo-400' />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {inquiry.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <FiCalendar className="h-3 w-3" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <FiMail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600 text-sm truncate">
                      {inquiry.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUser className="h-4 w-4 text-gray-400" />
                    <span className="text-indigo-600 text-sm font-medium">
                      {inquiry.phone}
                    </span>
                  </div>
                </div>

                {/* Message Preview */}
                <div className="mb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {getMessagePreview(inquiry.message)}
                  </p>
                </div>

                {/* Action Buttons - Stacked on Mobile */}
                <div className="flex flex-col gap-2">
                  <Link
                    href={`/properties/${inquiry.property_id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <FiEye className="h-4 w-4" />
                    View Property
                  </Link>
                  <button
                    onClick={() => handleDelete(inquiry.id)}
                    disabled={loadingStates[inquiry.id]}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingStates[inquiry.id] ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <FiTrash2 className="h-4 w-4" />
                        <span>Delete Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex flex-col lg:flex-row gap-4">
                {/* Property Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-16 flex justify-center items-center bg-gray-200 rounded-lg overflow-hidden">
                    <FaHouse className='h-5 w-5 text-indigo-400' />
                  </div>
                </div>

                {/* Inquiry Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FiUser className="h-4 w-4 text-gray-400" />
                        <h3 className="font-semibold text-gray-900 truncate">
                          {inquiry.name}
                        </h3>
                        <span className="text-gray-500">•</span>
                        <span className='flex flex-col'>
                        <span className="text-gray-600 text-sm truncate">
                          {inquiry.email}
                        </span>
                        <span className="text-indigo-400 text-md truncate">
                          {inquiry.phone}
                        </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FiCalendar className="h-3 w-3" />
                        <span>{formatDate(inquiry.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="mb-4">
                    <div className="flex items-start gap-2">
                      <FiMail className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {getMessagePreview(inquiry.message)}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(inquiry.id)}
                      disabled={loadingStates[inquiry.id]}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingStates[inquiry.id] ? (
                        <>
                          <div className="w-3 h-3 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                          <span>Deleting...</span>
                        </>
                      ) : (
                        <>
                          <FiTrash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </>
                      )}
                    </button>
                    <Link
                    href={`/properties/${inquiry.property_id}`}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                      <FiEye className="h-3 w-3" />
                      View Property
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FiMail className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
          <p className="text-gray-600">
            {searchTerm  
              ? 'Try adjusting your search or filter criteria.'
              : 'When users send inquiries about properties, they will appear here.'
            }
          </p>
        </div>
      )}

      {/* Results Count */}
      {filteredInquiries.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-600">
          Showing {filteredInquiries.length} of {agent_inquiries.length} inquiries
        </div>
      )}
    </>
    )}
   
    </>
  )
} 