'use client'

const LoginHero = () => {
  return (
    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      
      {/* Animated shapes */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-32 w-16 h-16 bg-white opacity-10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white px-8">
          <h1 className="text-4xl font-bold mb-4 animate-fade-in-left">
            HuluHouse Admin
          </h1>
          <p className="text-xl opacity-90 animate-fade-in-right">
            Manage your properties with ease
          </p>
          <div className="mt-8 space-y-4 animate-fade-in-up">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-white opacity-80">Property Management</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-white opacity-80">Inquiry Tracking</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-white opacity-80">Analytics Dashboard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginHero 