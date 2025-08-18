'use client'

import React, { useState } from 'react'

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // simulate success
      await new Promise(r => setTimeout(r, 800))
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-6">
          <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-medium text-neutral-800 mb-2">Check your email</h2>
        <p className="text-neutral-600 mb-8">
          If an account exists for {email}, you will receive a password reset link shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          Reset another password
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submitReset} className="mt-8 space-y-6 animate-fade-in-up">
      <div className="space-y-4">
        {/* Email Field */}
        <div className="group">
          <label htmlFor="email" className="block text-sm font-normal text-neutral-600 mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-neutral-400 group-focus-within:text-accent-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 4h16v16H4z" stroke="none"/><path d="M22 6l-10 7L2 6" strokeWidth="2"/></svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full pl-10 pr-4 py-3 border border-neutral-300 placeholder-neutral-500 text-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-600 focus:border-accent-600 focus:z-10 sm:text-sm transition-all duration-200 hover:border-neutral-400"
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Reset Password Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-800 to-primary-700 hover:from-primary-900 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Sending reset link...
            </>
          ) : (
            <>
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-accent-300 group-hover:text-accent-200 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.94 6.34A2 2 0 014.4 5h11.2a2 2 0 011.46 1.34l-7.06 4.9-7.06-4.9zM2 7.58V14a2 2 0 002 2h12a2 2 0 002-2V7.58l-8 5.56-8-5.56z" clipRule="evenodd" />
                </svg>
              </span>
              Send reset link
            </>
          )}
        </button>
      </div>

      {/* Back to login link */}
      <div className="text-center">
        <a 
          href="/admin" 
          className="text-sm font-normal text-accent-600 hover:text-accent-700 transition-colors"
        >
          ← Back to login
        </a>
      </div>
    </form>
  )
}

export default ResetPasswordForm
