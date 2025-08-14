'use client'

import useStore from '@/lib/store'
import LoginHero from './LoginHero'
import LoginForm from './LoginForm'
import StateSetting from './StateSetting'
import { useEffect } from 'react'
import { getAgent, getCurrentSession } from '@/lib/supabaseClient'
type AuthCheckProps = {
  children: React.ReactNode;
};

const AuthCheck = ({ children }: AuthCheckProps) => {
  const {isAuthenticated,loading,setLoading,setIsAuthenticated,setAgentData,agentData,logout} = useStore()

  const handleLogout = async () => {
    try {
      await logout()
      // This will redirect to login since isAuthenticated will be false
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(()=>{
    const getSession = async () => {
      setLoading(true)
         const agent_id = await getCurrentSession()
          if(agent_id){
            const data = await getAgent(agent_id)
            setAgentData(data)
            setIsAuthenticated(true)
          }

         setLoading(false)
    }
    getSession()

  },[setLoading, setAgentData, setIsAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Animated Logo */}
          <div className="mb-8">
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <h1 className="text-3xl font-bold text-white">HH</h1>
            </div>
          </div>

          {/* Main Loading Spinner */}
          <div className="relative w-16 h-16 mb-6 mx-auto">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-gray-100 rounded-full"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>

          {/* Loading Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Getting things ready</h2>
            <p className="text-gray-600 text-lg">Preparing your dashboard&hellip;</p>
            
            {/* Animated Dots */}
            <div className="flex items-center justify-center gap-1 mt-4">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full mt-8 mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse" style={{width: '75%'}}></div>
          </div>

          {/* Loading Steps */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Checking authentication...</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Loading your data...</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
              <span>Setting up dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    )
  } else if(!loading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
              <div className="flex min-h-screen">
                {/* Left side - Login Form */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                  <div className="max-w-md w-full space-y-8">
                    {/* Logo and Title */}
                    <div className="text-center animate-fade-in">
                      <div className="mx-auto h-16 w-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <h1 className="text-2xl font-bold text-white">HH</h1>
                      </div>
                      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Welcome back
                      </h2>
                      <p className="text-gray-600">
                        Sign in to your admin account
                      </p>
                    </div>

                    {/* Login Form Component */}
                    <LoginForm />

                    {/* Footer */}
                    <div className="text-center animate-fade-in">
                      <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{' '}
                        <span className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                          Contact administrator
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right side - Hero Component */}
                <LoginHero />
              </div>
            </div>
    )
  }


  // Check if account is deactivated
  if (agentData &&  agentData.is_active === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Deactivated Account Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Account Deactivated</h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Your account has been temporarily deactivated. This means you currently cannot access the admin panel or manage properties.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>What this means:</strong> You cannot access any admin features, add properties, view inquiries, or use the dashboard until your account is reactivated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Contact your administrator to reactivate your account</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Check your email for reactivation instructions</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Review any compliance requirements</span>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Contact Support</h3>
              <p className="text-red-700 text-sm mb-4">
                If you believe this is an error or need immediate assistance, please contact our support team.
              </p>
                          <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 0 002.22 0L21 8M5 19h14a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </button>
              <button 
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Account ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{agentData.id}</span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>
  {children}
  <StateSetting />
  </>  
           
}

export default AuthCheck 


   