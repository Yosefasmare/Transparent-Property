'use client'

import { MdOutlineApartment, MdAdd, MdSettings, MdMessage } from "react-icons/md"
import { TiMessages } from "react-icons/ti"
import { FaEye, FaHome, FaSignOutAlt } from "react-icons/fa"
import Link from "next/link"
import QwickLinks from "@/components/admin/QwickLinks"
import SoldProperties from "@/components/admin/SoldProperties"
import useStore from "@/lib/store"
import SummeryCards from "./SummeryCards"
import RecentProperties from "./properties/RecentProperties"
import RecentInquiries from "./inquiries/RecentInquiries"

const AdminDashboardLayout =  () => {

  const {agent_properties,agent_inquiries,stateLoader,logout} = useStore()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }


  const totalViews = agent_properties.reduce((total, property) => {
   return total + (property.views || 0);
 }, 0);

    return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header/Greeting Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, Agent!</h1>
                <p className="text-indigo-100 text-lg">Here&apos;s what&apos;s happening with your properties today.</p>
              </div>
              <div className="mt-6 lg:mt-0 flex gap-4">
                <Link
                 href={`/admin/properties/add-properties`}
                className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <MdAdd className="inline mr-2" />
                  Add New Property
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards Section */}
        <div className="flex w-full flex-wrap gap-6 mb-8">
          
          <SummeryCards title="Total Active Properties" value={agent_properties.length} icon={<FaHome className="w-6 h-6 text-blue-600" />} />
          <SummeryCards title="Total Views" value={totalViews} icon={<FaEye className="w-6 h-6 text-green-600" />} />
          <SummeryCards title="Inquiries" value={agent_inquiries.length} icon={<TiMessages className="w-6 h-6 text-purple-600" />} />
          {/* Sold Properties */}
           <SoldProperties  />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Properties */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Properties</h2>
              <Link
              href={`/admin/properties`}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View all</Link>
            </div>
            {stateLoader ? (
              <div className="flex flex-col items-center justify-center py-12">
                {/* Animated Loading Spinner */}
                <div className="relative w-12 h-12 mb-4">
                  <div className="absolute inset-0 border-3 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-3 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-1.5 border-3 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-1.5 border-3 border-transparent border-t-indigo-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                </div>
                
                {/* Loading Text */}
                <div className="text-center">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">Loading Properties</h3>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            ) : (
              <RecentProperties />
            )}
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Inquiries</h2>
              <Link
              href={`/admin/inquiries`}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View all</Link>
            </div>
             {stateLoader ? (
               <div className="flex flex-col items-center justify-center py-12">
                 {/* Animated Loading Spinner */}
                 <div className="relative w-12 h-12 mb-4">
                   <div className="absolute inset-0 border-3 border-gray-200 rounded-full"></div>
                   <div className="absolute inset-0 border-3 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
                   <div className="absolute inset-1.5 border-3 border-gray-100 rounded-full"></div>
                   <div className="absolute inset-1.5 border-3 border-transparent border-t-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                 </div>
                 
                 {/* Loading Text */}
                 <div className="text-center">
                   <h3 className="text-base font-semibold text-gray-800 mb-2">Loading Inquiries</h3>
                   <div className="flex items-center justify-center gap-1">
                     <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                     <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                     <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                   </div>
                 </div>
               </div>
             ) : (
               <RecentInquiries />
             )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 
            <QwickLinks  name={'Add Property'} link={'properties/add-properties'} p={'Create new listing'} icon={<MdAdd className="w-6 h-6 text-indigo-600" />} />
            <QwickLinks  name={'Manage Listings'} link={'properties'} p={'View all properties'} icon={<MdOutlineApartment className="w-6 h-6 text-green-600" />} />
            <QwickLinks  name={'View Inquiries'} link={'inquiries'} p={'Check messages'} icon={<MdMessage className="w-6 h-6 text-purple-600" />} />
            <QwickLinks  name={'Settings'} link={'settings'} p={'Profile & preferences'} icon={<MdSettings className="w-6 h-6 text-gray-600" />} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardLayout 