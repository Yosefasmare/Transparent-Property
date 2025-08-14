import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi'
import { FormData } from './types'

interface CredentialsStepProps {
  formData: FormData;
  showPassword: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CredentialsStep = ({ 
  formData, 
  showPassword, 
  onInputChange, 
  onTogglePassword, 
  onSubmit 
}: CredentialsStepProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
            onChange={onInputChange}
            className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="Enter your email address"
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
            autoComplete="current-password"
            required
            value={formData.tempPassword}
            onChange={onInputChange}
            className="appearance-none relative block w-full pl-10 pr-12 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="Enter temporary password from manager"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          This is the temporary password provided by your manager
        </p>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <FiArrowRight className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors" />
        </span>
        Continue to Invite Code
      </button>
    </form>
  )
}

export default CredentialsStep
