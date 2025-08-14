import { FiUser, FiPhone, FiCheck } from 'react-icons/fi'
import { ProfileData } from './types'

interface ProfileStepProps {
  profileData: ProfileData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileStep = ({ 
  profileData, 
  isLoading, 
  onInputChange, 
  onSubmit 
}: ProfileStepProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Full Name Field */}
      <div className="group">
        <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
          Full Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiUser className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            value={profileData.fullName}
            onChange={onInputChange}
            className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="Enter your full name"
          />
        </div>
      </div>

      {/* Phone Number Field */}
      <div className="group">
        <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiPhone className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            required
            value={profileData.phoneNumber || ''}
            onChange={onInputChange}
            className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400"
            placeholder="Enter your phone number"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          This helps clients and team members contact you
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving Profile...
          </>
        ) : (
          <>
            <FiCheck className="h-4 w-4 mr-2" />
            Complete Setup
          </>
        )}
      </button>
    </form>
  )
}

export default ProfileStep
