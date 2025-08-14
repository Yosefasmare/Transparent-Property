'use client'

import { FiPlus } from 'react-icons/fi'

const WelcomeBanner = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Welcome back, Agent Daniel!
          </h1>
          <p className="text-indigo-100 text-lg mb-4 lg:mb-0">
            &ldquo;Success in real estate is about building relationships and finding the perfect match between people and properties.&rdquo;
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <button className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200">
            <FiPlus className="mr-2 h-5 w-5" />
            Add New Property
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner 