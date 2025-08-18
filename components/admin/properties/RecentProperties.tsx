import useStore from '@/lib/store'
import React from 'react'
import {  FaHome } from 'react-icons/fa'


const RecentProperties = () => {

    const {agent_properties} = useStore()

    const recentProperties = agent_properties.slice(0, 3);

  return (
    <div className="space-y-4">
              {recentProperties.length > 0 ? (
                recentProperties.map((property, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <FaHome className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{property.title || `Property ${index + 1}`}</h3>
                      <p className="text-sm text-gray-600">{`${property.location.area},${property.location.state}` || 'Location not specified'}</p>
                      <div className="flex items-center mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          property.status === 'active' ? 'bg-green-100 text-green-800' :
                          property.status === 'sold' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {property.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaHome className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No properties added yet</p>
                </div>
              )}
            </div>
  )
}

export default RecentProperties