import { FiCheck, FiStar, FiUser, FiArrowRight } from 'react-icons/fi'

interface SuccessStepProps {
  onProceedToProfile: () => void;
}

const SuccessStep = ({ onProceedToProfile }: SuccessStepProps) => {
  return (
    <div className="text-center py-8">
      {/* Success Animation */}
      <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <FiCheck className="h-10 w-10 text-white" />
      </div>
      
      {/* Success Message */}
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        🎉 Welcome to the Team!
      </h2>
      <p className="text-gray-600 mb-6">
        Your account has been successfully created. Let&apos;s complete your profile to get you started.
      </p>
      
      {/* Success Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center mb-4">
          <FiStar className="h-6 w-6 text-green-600 mr-2" />
          <span className="text-green-800 font-semibold">Account Created Successfully</span>
        </div>
        <div className="text-sm text-green-700 space-y-2">
          <div className="flex items-center justify-center">
            <FiCheck className="h-4 w-4 mr-2" />
            Email verified and account activated
          </div>
          <div className="flex items-center justify-center">
            <FiCheck className="h-4 w-4 mr-2" />
            Access permissions configured
          </div>
        </div>
      </div>
      
      {/* Continue Button */}
      <button
        onClick={onProceedToProfile}
        className="w-full flex justify-center items-center py-3 px-6 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
      >
        <FiUser className="h-5 w-5 mr-2" />
        Complete Your Profile
        <FiArrowRight className="h-5 w-5 ml-2" />
      </button>
      
      <p className="text-xs text-gray-500 mt-4">
        This will only take a minute and helps your team recognize you
      </p>
    </div>
  )
}

export default SuccessStep
