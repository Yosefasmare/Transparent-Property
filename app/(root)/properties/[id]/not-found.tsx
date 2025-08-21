import { FaHome, FaExclamationTriangle, FaSearch, FaSadTear } from 'react-icons/fa'
import Link from 'next/link'

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-white via-blue-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <FaExclamationTriangle size={80} className="text-amber-500" />
            <FaSadTear size={40} className="text-red-500 absolute -top-2 -right-2" />
          </div>
        </div>

        {/* Main Error Message */}
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-800 mb-6 tracking-tight">
          Property Not Found
        </h1>
        
        <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          The property you&apos;re looking for may have been deleted, moved, or never existed. 
          This could happen if the listing has been removed or the URL is incorrect.
        </p>

        {/* Possible Reasons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">Possible reasons:</h3>
          <ul className="text-left text-neutral-600 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Property has been sold or rented
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              Listing has been removed by the agent
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              URL may be incorrect or outdated
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <FaSearch size={20} />
            <span>Browse All Properties</span>
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white font-medium px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <FaHome size={20} />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h3>
          <p className="text-blue-700 mb-4">
            If you believe this is an error or need assistance finding a specific property, 
            please contact our support team.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Contact Support
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
