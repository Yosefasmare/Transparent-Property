import { SignUpStep } from './types'

interface ProgressIndicatorProps {
  currentStep: SignUpStep;
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  if (currentStep === 'success') return null

  const steps = [
    { key: 'credentials', label: 'Credentials', number: 1 },
    { key: 'code', label: 'Invite Code', number: 2 },
    { key: 'profile', label: 'Profile', number: 3 }
  ]

  const getStepStatus = (stepKey: string) => {
    const stepIndex = steps.findIndex(step => step.key === stepKey)
    const currentIndex = steps.findIndex(step => step.key === currentStep)
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'upcoming'
  }

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'current':
        return 'text-indigo-600'
      default:
        return 'text-gray-400'
    }
  }

  const getCircleClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100'
      case 'current':
        return 'bg-indigo-100 border-2 border-indigo-600'
      default:
        return 'bg-gray-100'
    }
  }

  const getConnectorClasses = (stepKey: string) => {
    const stepIndex = steps.findIndex(step => step.key === stepKey)
    const currentIndex = steps.findIndex(step => step.key === currentStep)
    
    if (stepIndex < currentIndex) return 'bg-indigo-200'
    return 'bg-gray-200'
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key)
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center space-x-2 ${getStepClasses(status)}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCircleClasses(status)}`}>
                  {status === 'completed' ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-medium">{step.label}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${getConnectorClasses(step.key)}`}></div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressIndicator
