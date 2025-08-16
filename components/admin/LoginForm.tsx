'use client'

import { useState } from 'react'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import useStore from '@/lib/store'
import { getAgent, resetPassword, signInWithEmail } from '@/lib/supabaseClient'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const {setIsAuthenticated,setLoading,loading,setAgentData,stateLoader,setStateLoader} = useStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error and success when user starts typing
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setStateLoader(true)

    if(formData.email === '' || formData.password === '') {
      setError('please fill the form first!')
      setStateLoader(false)
      return
    }


  const {agentID,error} =  await signInWithEmail(formData.email,formData.password)

    if(error){
      console.log(error)
      setError(error)
      setLoading(false)
    setStateLoader(false)

      return
    }

   setLoading(true)


    if (agentID) {
        const agent = await getAgent(agentID)
         setAgentData({
          id: agent.id,
          name: agent.name,
          email: agent.email,
          phone_no: agent.phone_no,
          isManager: agent.isManager,
          profilePic_path: agent.profilePic_path,
          sold_properties: agent.sold_properties,
          is_active: agent.is_active,
          created_at: agent.created_at
         })
        setIsAuthenticated(true)
    } else {
      setError('Invalid email or password. Please try again.')
    }
    setStateLoader(false)
    setLoading(false)
  }

  const handleResetPassword = async () => {
    if(formData.email === '') {
      setError('Please! Fill the Email Field First!')
      return
    }
    
    try {
      setError('') // Clear any existing errors
      setSuccess('') // Clear any existing success messages
      
      const {message, type} = await resetPassword(formData.email)
      
      if (type === 'success') {
        setSuccess(message)
      } else {
        setError(message)
      }
    } catch {
      setError('Failed to send reset password email. Please try again.')
    }
  }


  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6 animate-fade-in-up">
      <div className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-fade-in">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm animate-fade-in">
            ✅ {success}
          </div>
        )}

        {/* Email Field */}
        <div className="group">
          <label htmlFor="email" className="block text-sm font-normal text-gray-600 mb-2">
            Email address
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
              className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="group">
          <label htmlFor="password" className="block text-sm font-normal text-gray-600 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400"
              placeholder="Enter your password"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Remember Me and Forgot Password */}
      <div className="flex items-center justify-end">
        <div className="text-sm">
          <button 
          onClick={()=>handleResetPassword()}
          className="font-normal text-indigo-600 hover:text-indigo-500 transition-colors">
            Forgot your password?
          </button>
        </div>
      </div>

      {/* Sign In Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {stateLoader ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
              Sign in
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default LoginForm 