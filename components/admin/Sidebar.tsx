'use client'

import { FiX, FiHome, FiMapPin, FiMessageSquare, FiSettings, FiLogOut } from 'react-icons/fi'
import { useMobileSidebar } from './MobileSidebarContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const { isMobileSidebarOpen, closeMobileSidebar } = useMobileSidebar()
  const pathname = usePathname()
  
  const navItems = [
    { name: 'Dashboard', icon: FiHome, href: '/admin' },
    { name: 'My Properties', icon: FiMapPin, href: '/admin/properties' },
    { name: 'Inquiries', icon: FiMessageSquare, href: '/admin/inquiries' },
    { name: 'Settings', icon: FiSettings, href: '/admin/settings' },
  ]

  // Function to check if a nav item is active
  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin' || pathname.startsWith('/admin/') && !pathname.includes('/properties') && !pathname.includes('/inquiries') && !pathname.includes('/settings')
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar - Only visible on mobile */}
      <div
        className={`fixed h-screen inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            <button
              onClick={closeMobileSidebar}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? 'text-indigo-600 bg-indigo-50 border-r-2 border-indigo-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={closeMobileSidebar}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/logout"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Logout
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar 