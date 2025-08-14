'use client'

import { makeAgentInviteCode } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react'
import { FiMail, FiLock, FiEye, FiEyeOff, FiPlus, FiClock, FiCopy } from 'react-icons/fi'

type InviteResponse = {
  code: string | null;
  expiresAt: string | null;
  message: string;
  type: string
};

const AddAgentForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    tempPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [res,setRes] = useState<InviteResponse>({
    code: null,
    expiresAt: null,
    message: '',
    type: ''
  })
  const [timeLeft, setTimeLeft] = useState(0) // in seconds
  const [timerActive, setTimerActive] = useState(false)

  // Combined timer effect - handles both initialization and countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    // Initialize timer when code is first set
    if (res.code && !timerActive && timeLeft === 0) {
      console.log('🚀 Starting timer for code:', res.code)
      setTimeLeft(300) // 5 minutes = 300 seconds
      setTimerActive(true)
      return // Exit early to let the next render start the countdown
    }
    
    // Start countdown when timer is active and has time left
    if (timerActive && timeLeft > 0) {
      console.log('⏰ Timer active, time left:', timeLeft)
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1
          console.log('⏳ Countdown:', newTime)
          
          if (newTime <= 0) {
            console.log('⏰ Timer expired!')
            setTimerActive(false)
            // Auto-clear code and restore form when timer expires
            setTimeout(() => {
              setRes({ code: null, expiresAt: null, message: '', type: '' })
              setSuccess('Code expired. You can now create a new agent.')
              setTimeout(() => setSuccess(''), 3000)
            }, 1000) // Wait 1 second after timer hits 0 before clearing
            return 0
          }
          return newTime
        })
      }, 1000)
    }
    
    // Reset timer when code is cleared manually
    if (!res.code && (timerActive || timeLeft > 0)) {
      console.log('🔄 Resetting timer - code cleared')
      setTimerActive(false)
      setTimeLeft(0)
    }

    return () => {
      if (interval) {
        console.log('🧹 Cleaning up timer interval')
        clearInterval(interval)
      }
    }
  }, [res.code, timerActive, timeLeft])

  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Copy code to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSuccess('Code copied to clipboard!')
      setTimeout(() => setSuccess(''), 2000)
    } catch {
      setError('Failed to copy code')
    }
  }

  // Reset form to create another agent
  const resetForm = () => {
    setRes({ code: null, expiresAt: null, message: '', type: '' })
    setTimeLeft(0)
    setTimerActive(false)
    setFormData({ email: '', tempPassword: '' })
    setError('')
    setSuccess('')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
    // Clear API response messages if they exist
    if (res.message && (res.type === 'error' || (res.type === 'success' && !res.code))) {
      setRes(prev => ({ ...prev, message: '', type: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    // Clear any previous API response messages
    if (res.message && !res.code) {
      setRes(prev => ({ ...prev, message: '', type: '' }))
    }
    setIsLoading(true)

    // Basic validation
    if (!formData.email || !formData.tempPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    if (formData.tempPassword.length < 6) {
      setError('Temporary password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      setIsLoading(false)
      return
    }
          try {
       
        const email = formData.email
        const tempPass = formData.tempPassword
        const {code,message,type,expires_at} = await makeAgentInviteCode(email,tempPass)
        
        // Always set the response with message and type
        setRes({
          code,
          expiresAt: expires_at,
          message,
          type
        })

        // Handle different response types
        if (type === 'success') {
          setSuccess(message)
          if (code) {
            // Clear form only if code was successfully generated
            setFormData({
              email: '',
              tempPassword: ''
            })
          }
        } else if (type === 'error') {
          setError(message)
        }
    } catch {
      setError('Failed to create agent account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <FiPlus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Agent</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Create a new agent account with email and temporary password.
        </p>
      </div>

      {/* Mobile Timer - Shows above form on small screens */}
      {res.code && (
        <div className="lg:hidden mb-8">
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiClock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">Invite Code Generated</h3>
                <p className="text-sm text-green-600">Share this code with the agent to complete registration</p>
              </div>
            </div>

            {/* Code Display */}
            <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
              <div className="flex items-center justify-between">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded-lg flex-1">
                      {res.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(res.code!)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      <FiCopy className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer Display */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${timeLeft > 60 ? 'bg-green-100' : timeLeft > 30 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                  <FiClock className={`h-5 w-5 ${timeLeft > 60 ? 'text-green-600' : timeLeft > 30 ? 'text-yellow-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Time Remaining</p>
                  <p className="text-xs text-gray-500">
                    {timeLeft <= 10 ? 'Form will restore automatically' : 'Code expires automatically'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold font-mono ${timeLeft > 60 ? 'text-green-600' : timeLeft > 30 ? 'text-yellow-600' : 'text-red-600'} ${timeLeft <= 10 && timeLeft > 0 ? 'animate-pulse' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-gray-500">MM:SS</p>
              </div>
            </div>

            {/* Expiration Warning */}
            {timeLeft === 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm font-medium text-red-800">Code has expired</p>
                </div>
                <p className="text-xs text-red-600 mt-1">Please generate a new invite code for the agent</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Layout - Form and Timer Side by Side */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Container */}
        <div className="flex-1 max-w-2xl">
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative ${res.code ? 'opacity-60' : ''}`}>
            {res.code && (
              <div className="absolute inset-0 bg-gray-50 bg-opacity-50 rounded-xl flex items-center justify-center z-10">
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 max-w-sm">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Agent Created Successfully!</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      The invite code has been generated and is ready to share with the agent.
                    </p>
                    <button
                      onClick={resetForm}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                      Create Another Agent
                    </button>
                  </div>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {(error || (res.type === 'error' && res.message)) && (
              <div className="bg-red-50 capitalize border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-fade-in">
                {error || res.message}
              </div>
            )}

            {/* Success Message */}
            {(success || (res.type === 'success' && res.message && !res.code)) && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm animate-fade-in">
                {success || res.message}
              </div>
            )}

            {/* Email Field */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter agent email address"
                  disabled={isLoading || !!res.code}
                />
              </div>
            </div>

            {/* Temporary Password Field */}
            <div className="group">
              <label htmlFor="tempPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Temporary Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="tempPassword"
                  name="tempPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.tempPassword}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400"
                  placeholder="Enter temporary password"
                  disabled={isLoading || !!res.code}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors `}
                  disabled={isLoading || res.code !== null}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Temporary password must be at least 6 characters long
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !!res.code}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <FiPlus className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
                    </span>
                    Create Agent Account
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Important Notes</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• The agent will receive an email notification with login credentials</li>
                  <li>• Temporary password must be at least 6 characters long</li>
                  <li>• Agent can change their password after first login</li>
                </ul>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Desktop Timer - Shows next to form on large screens */}
        {res.code && (
          <div className="hidden lg:block lg:w-96">
            <div className="sticky top-8">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiClock className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Invite Code</h3>
                    <p className="text-sm text-green-600">Share with agent</p>
                  </div>
                </div>

                {/* Code Display */}
                <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded-lg flex-1 text-center">
                      {res.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(res.code!)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      title="Copy to clipboard"
                    >
                      <FiCopy className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Timer Display */}
                <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold font-mono mb-2 ${timeLeft > 60 ? 'text-green-600' : timeLeft > 30 ? 'text-yellow-600' : 'text-red-600'} ${timeLeft <= 10 && timeLeft > 0 ? 'animate-pulse' : ''}`}>
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-sm font-medium text-gray-700">Time Remaining</p>
                    <p className="text-xs text-gray-500">
                      {timeLeft <= 10 ? 'Form will restore automatically' : 'Code expires automatically'}
                    </p>
                  </div>
                </div>

                {/* Timer Status Indicator */}
                <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${timeLeft > 60 ? 'bg-green-100' : timeLeft > 30 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                  <FiClock className={`h-4 w-4 ${timeLeft > 60 ? 'text-green-600' : timeLeft > 30 ? 'text-yellow-600' : 'text-red-600'}`} />
                  <span className={`text-sm font-medium ${timeLeft > 60 ? 'text-green-700' : timeLeft > 30 ? 'text-yellow-700' : 'text-red-700'}`}>
                    {timeLeft > 60 ? 'Active' : timeLeft > 30 ? 'Expiring Soon' : timeLeft > 0 ? 'Almost Expired' : 'Expired'}
                  </span>
                </div>

                {/* Expiration Warning */}
                {timeLeft === 0 && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm font-medium text-red-800">Code Expired</p>
                    </div>
                    <p className="text-xs text-red-600 mt-1">Generate a new code</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddAgentForm
