'use client'

import { FiHome, FiMessageSquare, FiCheckCircle, FiClock } from 'react-icons/fi'

const StatsCards = () => {
  const stats = [
    {
      title: 'Total Properties Listed',
      value: '24',
      change: '+12%',
      changeType: 'positive',
      icon: FiHome,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Inquiries',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: FiMessageSquare,
      color: 'bg-green-500',
    },
    {
      title: 'Properties Sold',
      value: '18',
      change: '+15%',
      changeType: 'positive',
      icon: FiCheckCircle,
      color: 'bg-purple-500',
    },
    {
      title: 'Properties Pending',
      value: '6',
      change: '-2%',
      changeType: 'negative',
      icon: FiClock,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-normal text-gray-600">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-medium text-gray-800 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-normal ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards 