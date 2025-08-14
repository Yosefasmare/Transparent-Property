'use client'

import { saveAgentInfo, validateInvitedCode } from '@/lib/supabaseClient'
import { useState } from 'react'
import { SignUpStep, ResType, FormData, ProfileData } from './types'
import SignUpHeader from './SignUpHeader'
import ProgressIndicator from './ProgressIndicator'
import CredentialsStep from './CredentialsStep'
import InviteCodeStep from './InviteCodeStep'
import SuccessStep from './SuccessStep'
import ProfileStep from './ProfileStep'
import InfoSection from './InfoSection'
import { useRouter } from 'next/navigation'

const SignUpForm = () => {
  const [currentStep, setCurrentStep] = useState<SignUpStep>('credentials')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    tempPassword: '',
    inviteCode: ''
  })
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    phoneNumber: 0
  })
  const [res,setRes] = useState<ResType>({
    hasSignedUp: false,
    message: '',
    type: '',
    authEmail: null,
    authId: null
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router =  useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear messages when user starts typing
    if (error) setError('')
  }

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.email || !formData.tempPassword) {
      setError('Please fill in all fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    if (formData.tempPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    // Move to code step
    setCurrentStep('code')
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!formData.inviteCode.trim()) {
      setError('Please enter your invite code')
      setIsLoading(false)
      return
    }

    try {

      const {hasSignedUp,message,type,authEmail,authId} = await validateInvitedCode(formData.email,formData.tempPassword,formData.inviteCode)
      setRes({
        hasSignedUp,
        message,
        type,
        authEmail,
        authId
      })
      
      if (hasSignedUp) {
        setCurrentStep('success')
      }
      
      // Reset form
      setFormData({
        email: '',
        tempPassword: '',
        inviteCode: ''
      })
    } catch (err) {
      console.log(err)
      setError('Failed to create account. Please check your invite code and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    setCurrentStep('credentials')
    setError('')
  }

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }



  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Basic validation
    if (!profileData.fullName.trim()) {
      setError('Please enter your full name')
      setIsLoading(false)
      return
    }

    if (isNaN(profileData.phoneNumber)) {
      setError('Please enter a valid your phone number')
      setIsLoading(false)
      return
    }

    try {

      if(!res.authId && !res.authEmail)  return

 
      const {message,type} = await saveAgentInfo(res.authId!,profileData.fullName,res.authEmail!,profileData.phoneNumber)
      if(type === 'error'){
        setError(message)
      }

      // Reset everything
  
      router.push('/admin/settings')

      setProfileData({
        fullName: '',
        phoneNumber: 0
      })
      setCurrentStep('credentials')
      setRes({ hasSignedUp: false, message: '', type: '',authEmail: null,authId: null })
    } catch (err) {
      console.log(err)
      setError('Failed to save profile information. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const proceedToProfile = () => {
    setCurrentStep('profile')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'credentials':
        return (
          <CredentialsStep
            formData={formData}
            showPassword={showPassword}
            onInputChange={handleInputChange}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleCredentialsSubmit}
          />
        )
      case 'code':
        return (
          <InviteCodeStep
            formData={formData}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleCodeSubmit}
            onGoBack={goBack}
          />
        )
      case 'success':
        return <SuccessStep onProceedToProfile={proceedToProfile} />
      case 'profile':
        return (
          <ProfileStep
            profileData={profileData}
            isLoading={isLoading}
            onInputChange={handleProfileInputChange}
            onSubmit={handleProfileSubmit}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUpHeader currentStep={currentStep} />
        <ProgressIndicator currentStep={currentStep} />

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Error Messages */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm animate-fade-in">
              {error}
            </div>
          )}

          {renderStep()}
          <InfoSection />
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
