export type SignUpStep = 'credentials' | 'code' | 'success' | 'profile'

export type ResType = {
  hasSignedUp: boolean;
  message: string;
  type: string;
  authEmail: string | null;
  authId: string | null
}

export type FormData = {
  email: string;
  tempPassword: string;
  inviteCode: string;
}

export type ProfileData = {
  fullName: string;
  phoneNumber: number;
}

export interface SignUpContextType {
  currentStep: SignUpStep;
  setCurrentStep: (step: SignUpStep) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  res: ResType;
  setRes: (res: ResType) => void;
  error: string;
  setError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}
