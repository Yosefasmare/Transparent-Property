'use client'

import useStore from '@/lib/store'
import React from 'react'
import { FiUsers, FiUserCheck, FiTrendingUp, FiUserX, FiChevronDown, FiChevronRight } from 'react-icons/fi'

const AgentsStats = () => {

  const {agents,stateLoader} = useStore()
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const stats = [
    {
      title: 'Total Agents + Managers',
      value: agents.length + 1,
      icon: FiUsers,
      color: 'bg-blue-500',
      description: 'Total team members'
    },
    {
      title: 'Managers',
      value: agents.filter(agent => agent.isManager).length + 1,
      icon: FiUserCheck,
      color: 'bg-purple-500',
      description: 'Management team'
    },
    {
      title: 'Active Agents',
      value: agents.filter(agent => !agent.isManager && agent.is_active).length,
      icon: FiUserCheck,
      color: 'bg-green-500',
      description: 'Currently active agents (non-managers)'
    },
    {
      title: 'Deactivated Accounts',
      value: agents.filter(agent => !agent.is_active).length,
      icon: FiUserX,
      color: 'bg-red-500',
      description: 'Inactive accounts'
    },
    {
      title: 'Total Properties Sold',
      value: agents.reduce((total, agent) => total + agent.sold_properties, 0),
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      description: 'Combined sales'
    }
  ]

  if (stateLoader) {
    return (
     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
       <div className="p-4 border-b border-gray-200">
         <button
           onClick={() => setIsCollapsed(!isCollapsed)}
           className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
         >
           <FiChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-90'}`} />
           Agent Statistics
         </button>
       </div>
       {!isCollapsed && (
         <div className="p-4">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
             {[...Array(5)].map((_, index) => (
               <div key={index} className="bg-gray-50 rounded-lg p-6 animate-pulse">
                 <div className="flex items-center justify-between">
                   <div className="flex-1">
                     <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                     <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                     <div className="h-3 bg-gray-200 rounded w-32"></div>
                   </div>
                   <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}
     </div>
   )
 }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FiChevronRight className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-90'}`} />
          Agent Statistics
        </button>
      </div>
      {!isCollapsed && (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentsStats
