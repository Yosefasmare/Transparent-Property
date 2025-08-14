import { FiUserPlus } from 'react-icons/fi'
import { SignUpStep } from './types'

interface SignUpHeaderProps {
  currentStep: SignUpStep;
}

const SignUpHeader = ({ currentStep }: SignUpHeaderProps) => {
  const getTitle = () => {
    switch (currentStep) {
      case 'success':
        return 'Account Created!'
      case 'profile':
        return 'Complete Profile'
      default:
        return 'Join as Agent'
    }
  }

  const getDescription = () => {
    switch (currentStep) {
      case 'credentials':
        return 'Enter your credentials provided by your manager'
      case 'code':
        return 'Enter the invite code to complete registration'
      case 'success':
        return 'Welcome to the team! Your account is ready.'
      case 'profile':
        return 'Add your information to complete setup'
      default:
        return ''
    }
  }

  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
        <FiUserPlus className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {getTitle()}
      </h1>
      <p className="text-gray-600">
        {getDescription()}
      </p>
    </div>
  )
}

export default SignUpHeader
