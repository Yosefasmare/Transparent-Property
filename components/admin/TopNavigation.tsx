'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { FiMenu, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import { useMobileSidebar } from './MobileSidebarContext'
import Link from 'next/link'
import useStore from '@/lib/store'
import Image from 'next/image'

const TopNavigation =  () => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const { toggleMobileSidebar } = useMobileSidebar()

  const pathname = usePathname()
  const {agentData,logout} = useStore()

    const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  let profilePic_url = null

  if(!process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL){
    console.log('Public Url Is not Found')
    profilePic_url =null
  }

  profilePic_url = `${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/agent-avater/${agentData?.profilePic_path}`
  const navLinks = [
    { name: 'Dashboard', href: `/admin` },
    { name: 'Properties', href: `/admin/properties` },
    { name: 'Inquiries', href: `/admin/inquiries` },
    // Add Agents tab only for managers
    ...(agentData?.isManager ? [{ name: 'Agents', href: `/admin/agents` }] : []),
    { name: 'Settings', href: `/admin/settings` },
  ]


  return (
    <nav className=" w-full mb-14  bg-white shadow-sm border-b border-gray-200">
      <div className="fixed w-full  z-50  bg-indigo-100  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center">
            <button
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <FiMenu className="h-6 w-6" />
            </button>
            
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-medium text-indigo-600">HulluHouse</h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:ml-8 lg:flex right-0 lg:space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-normal transition-colors ${
                      isActive
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center space-x-4">
            
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center overflow-hidden">
                  {agentData?.profilePic_path ? (
                    <Image
                     src={profilePic_url}
                     alt={'agent profile pic'}
                     width={80}
                     height={80}
                     className='w-full h-full'
                     />
                  ) :
                  <FiUser className="h-4 w-4 text-white" />
                  }
                </div>
                <span className="hidden md:block text-sm font-normal">
                  {agentData?.isManager ? 'Manager' : 'Agent'} <span className='text-lg font-serif underline text-green-600 font-medium'>{agentData?.name}</span>
                </span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    href="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <FiSettings className="mr-3 h-4 w-4" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNavigation 