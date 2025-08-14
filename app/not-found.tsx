import BackButton from '@/components/BackButton'
import Link from 'next/link'
import { FaHouse, FaMagnifyingGlass } from 'react-icons/fa6'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 blur-3xl opacity-20"></div>
        </div>

        {/* Main Message */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have wandered off. Don&apos;t worry, 
            we&apos;ll help you find your way back home.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            href="/"
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FaHouse size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            Go Home
          </Link>
          
          <Link 
            href="/properties"
            className="group flex items-center gap-3 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <FaMagnifyingGlass size={20} className="group-hover:scale-110 transition-transform duration-300" />
            Browse Properties
          </Link>
        </div>

       <BackButton />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-300 rounded-full blur-2xl opacity-20 animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-10 w-20 h-20 bg-purple-300 rounded-full blur-2xl opacity-20 animate-pulse delay-700"></div>
      </div>
    </div>
  )
}
