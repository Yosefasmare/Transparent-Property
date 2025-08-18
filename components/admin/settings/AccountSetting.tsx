'use client'


import useStore from '@/lib/store'
import { uploadProfileImage, updateProfile } from '@/lib/supabaseClient'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FaUserTie } from 'react-icons/fa6'
import { FiCheck, FiSave, FiUpload, FiUser, FiX } from 'react-icons/fi'

const AccountSetting = () => {
     const [selectedFile, setSelectedFile] = useState<File | null>(null)
      const [previewUrl, setPreviewUrl] = useState<string | null>(null)
      const [showPreview, setShowPreview] = useState(false)
      const [uploading, setUploading] = useState(false)
      const [saving, setSaving] = useState(false)
      const fileInputRef = useRef<HTMLInputElement>(null)
      const [changedInfo,setChangedInfo] = useState({
          name: '',
          email: '',
          phone_no: 0,
          profile_pic:''
      
        })
     const [hasChanges, setHasChanges] = useState(false)

      const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
      const {agentData,setAgentData} = useStore()

       let profilePic_url = null

      if(!process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL){
        console.log('Public Url Is not Found')
        profilePic_url =null
      }
    
      profilePic_url = `${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/agent-avater/${agentData?.profilePic_path}`

      // Initialize changedInfo with current agent data
      useEffect(() => {
        if (agentData) {
          setChangedInfo({
            name: agentData.name || '',
            email: agentData.email || '',
            phone_no: agentData.phone_no || 0,
            profile_pic: profilePic_url || ''
          })
        }
      }, [agentData,profilePic_url])

      // Check for changes
      useEffect(() => {
        if (agentData) {
          const hasNameChanged = changedInfo.name !== agentData.name
          const hasEmailChanged = changedInfo.email !== agentData.email
          const hasPhoneChanged = changedInfo.phone_no !== agentData.phone_no
          
          setHasChanges(hasNameChanged || hasEmailChanged || hasPhoneChanged)
        }
      }, [changedInfo, agentData])

      const handleSaveChanges = async () => {
        if (!agentData?.id) {
          setMessage({
            text: 'Agent not found',
            type: 'error'
          })
          return
        }

        setSaving(true)
        try {
          const updateData: { name?: string; email?: string; phone_no?: number } = {}
          
          if (changedInfo.name !== agentData.name) {
            updateData.name = changedInfo.name
          }
          if (changedInfo.email !== agentData.email) {
            updateData.email = changedInfo.email
          }
          if (changedInfo.phone_no !== agentData.phone_no) {
            updateData.phone_no = changedInfo.phone_no
          }

          const { message: responseMessage, type } = await updateProfile(agentData.id, updateData)

          setMessage({
            text: responseMessage,
            type: type
          })

          if (type === 'success') {
            // Update local state with new data
            setAgentData({
              ...agentData,
              ...updateData
            })
            setHasChanges(false)
          }
        } catch (error) {
          console.error('Save error:', error)
          setMessage({
            text: 'Failed to save changes. Please try again.',
            type: 'error'
          })
        } finally {
          setSaving(false)
        }
      }

      const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
          // Validate file type
          if (!file.type.startsWith('image/')) {
             setMessage({
                text: 'Please select a valid image file',
                type: 'error'
            })
            return
          }
          
          // Validate file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            setMessage({
                text: 'File size must be less than 5MB',
                type: 'error'
            })
            return
          }
    
          setSelectedFile(file)
          
          // Create preview URL
          const url = URL.createObjectURL(file)
          setPreviewUrl(url)
          setShowPreview(true)
        }
      }
    
      const handleConfirmUpload = async () => {
        if (!selectedFile) return
    
        setUploading(true)
        try {
    
          if(!agentData?.id){
             setMessage({
            text: 'Agent not Found',
            type: 'error'
          })
            return
          }
            
          const {data,message,type} = await uploadProfileImage(selectedFile,agentData?.id)
    
          setMessage({
            text: message,
            type: type as 'success' | 'error'
          })

          if(data && agentData){
            setAgentData({...agentData, profilePic_path:data})
          }


          
          // Reset states
          setSelectedFile(null)
          setPreviewUrl(null)
          setShowPreview(false)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
    
          // Refresh agent data (you might need to implement this in your store)
          // For now, we'll just show success message
          
        } catch (error) {
          console.error('Upload error:', error)
          setMessage({
            text: 'Failed to upload image. Please try again.',
            type: 'error'
          })
        } finally {
          setUploading(false)
        }
      }
    
      const handleCancelUpload = () => {
        setSelectedFile(null)
        setPreviewUrl(null)
        setShowPreview(false)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    
      const handleUploadClick = () => {
        fileInputRef.current?.click()
      }
    
      // Cleanup preview URL on unmount
      useEffect(() => {
        return () => {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
          }
        }
      }, [previewUrl])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiUser className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
            </div>

            {/* Message Notification */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg border-l-4 shadow-lg ${
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
    
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Picture */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center  overflow-hidden bg-gray-200">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        width={80}
                        height={80}
                      />
                    ) : agentData?.profilePic_path ? (
                      <Image
                        src={profilePic_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        width={20}
                        height={20}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FaUserTie className='text-indigo-500 w-7 h-7' />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {!showPreview ? (
                      <button 
                        onClick={handleUploadClick}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <FiUpload className="h-4 w-4" />
                        Upload New Photo
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleConfirmUpload}
                          disabled={uploading}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          {uploading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <FiCheck className="h-4 w-4" />
                              <span>Confirm</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancelUpload}
                          disabled={uploading}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                    
                    {selectedFile && (
                      <p className="text-xs text-gray-500">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
    
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={changedInfo.name}
                  onChange={(e) => setChangedInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
    
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={changedInfo.email}
                  onChange={(e) => setChangedInfo(prev=>({...prev,email: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
    
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="number"
                  value={changedInfo.phone_no}
                  onChange={(e) => setChangedInfo(prev=>({...prev,phone_no:Number(e.target.value)}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
    
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveChanges}
                disabled={!hasChanges || saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <FiSave className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
  )
}

export default AccountSetting
