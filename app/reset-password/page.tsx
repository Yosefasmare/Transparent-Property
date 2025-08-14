import React from 'react'
import { FiLock } from 'react-icons/fi'
import ResetPasswordForm from '@/components/ResetPasswordForm'

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-6">
            <FiLock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">
            Enter your new password below. Make sure it&apos;s strong and secure.
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  )
}

export default ResetPasswordPage