'use client'

import { sendInquiry } from '@/lib/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FaPhone, FaEnvelope } from 'react-icons/fa6'




type Props = {
  postedBy: {
    id: string,
    name: string,
    profilePic_path: string;
    email: string;
    phone_no: number
  },
  propertyId: string
}


const PropertyContact = ({ postedBy,propertyId }: Props) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [inqMessage,setInqMessage] = useState({
    message: '',
    type: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Auto-dismiss message after 5 seconds
  useEffect(() => {
    if (inqMessage.message) {
      const timer = setTimeout(() => {
        setInqMessage({ message: '', type: '' })
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [inqMessage.message])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear any existing messages when user starts typing
    if (inqMessage.message) {
      setInqMessage({ message: '', type: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await handleSend(propertyId, formData)
      
      // Reset form on success
      if (inqMessage.type === 'success') {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        })
      }
    } catch (error) {
      console.error('Error in form submission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleSend = async (propertyId: string,formData: { name: string; email: string; phone: string; message: string }) => {
    try {
      const agent_id = postedBy.id
      const {message,type} = await sendInquiry(propertyId, agent_id, formData)

      
      setInqMessage({
        message,
        type
      })
      
    } catch (error) {
      console.error('Error sending inquiry:', error)
      alert('An error occurred while sending your inquiry. Please try again later.')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      {/* Agent Information */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-4">Contact Agent</h3>
        <div className="flex items-start gap-4 mb-4">
        <div className='w-16 h-16 rounded-full flex justify-center items-center object-fill overflow-hidden'>
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/agent-avater/${postedBy?.profilePic_path}`}
            alt={postedBy.name}
            width={80}
            height={80}
            className="w-full h-full  object-fit"
          />
          </div>
          <div className="flex-1">
            <span className='font-medium text-gray-700'>Agent</span>
            <h3 className="font-medium text-gray-800">{postedBy.name}</h3>
          </div>
        </div>
        
        {/* Contact Methods */}
        <div className="space-y-3">
          <Link
            href={`tel:+${postedBy.phone_no || '25123456789'}`}
            className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors duration-300"
          >
            <FaPhone className="text-indigo-500" />
            <span className="font-normal">+{postedBy.phone_no || '25123456789'}</span>
          </Link>
          <Link
            href={`mailto:${postedBy.email || 'support@transparentproperty.com'}`}
            className="flex items-center gap-3 p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-300"
          >
            <FaEnvelope className="text-gray-500" />
            <span className="font-normal">{postedBy.email || 'support@transparentproperty.com'}</span>
          </Link>
        </div>
      </div>

      {/* Inquiry Form */}
      <div>
        <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-4">Send Inquiry</h3>
        
        {/* Inline Message Display */}
        {inqMessage.message && (
          <div className={`mb-4 p-4 rounded-xl border-l-4 ${
            inqMessage.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                inqMessage.type === 'success' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {inqMessage.type === 'success' ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-normal ${
                  inqMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {inqMessage.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm mt-1 ${
                  inqMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {inqMessage.message}
                </p>
              </div>
              <button
                onClick={() => setInqMessage({ message: '', type: '' })}
                className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-80 transition-colors ${
                  inqMessage.type === 'success' 
                    ? 'hover:bg-green-200' 
                    : 'hover:bg-red-200'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-normal text-gray-600 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-normal text-gray-600 mb-2">
              Email Address 
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-normal text-gray-600 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              required
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              placeholder="Enter your phone number"
            />
          </div>


          <div>
            <label htmlFor="message" className="block text-sm font-normal text-gray-600 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Tell us about your interest in this property..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PropertyContact 