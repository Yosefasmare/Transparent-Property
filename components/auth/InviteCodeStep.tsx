import { FiKey, FiArrowLeft, FiShield } from 'react-icons/fi'
import { FormData } from './types'

interface InviteCodeStepProps {
  formData: FormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoBack: () => void;
}

const InviteCodeStep = ({ 
  formData, 
  isLoading, 
  onInputChange, 
  onSubmit, 
  onGoBack 
}: InviteCodeStepProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Invite Code Field */}
      <div className="group">
        <label htmlFor="inviteCode" className="block text-sm font-semibold text-gray-700 mb-2">
          Invite Code
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiKey className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            id="inviteCode"
            name="inviteCode"
            type="text"
            required
            value={formData.inviteCode}
            onChange={onInputChange}
            className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all duration-200 hover:border-gray-400 font-mono text-center text-lg tracking-widest"
            placeholder="Enter invite code"
            style={{ textTransform: 'uppercase' }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Enter the invite code provided by your manager
        </p>
      </div>

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onGoBack}
          className="flex-1 flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          <FiArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
        
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </>
          ) : (
            <>
              <FiShield className="h-4 w-4 mr-2" />
              Create Account
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default InviteCodeStep
