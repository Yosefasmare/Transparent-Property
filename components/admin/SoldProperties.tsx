'use client'

import useStore from '@/lib/store'
import React from 'react'
import { FaTimesCircle } from 'react-icons/fa'

const SoldProperties = () => {

    const {agentData,stateLoader} = useStore()

  return (
     <div className="bg-white flex-1 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className=' flex flex-col justify-center items-center text-center'>
          <p className="text-sm font-medium text-gray-600 mb-1">Sold Properties</p>
          {stateLoader ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{agentData?.sold_properties}</p>
          )}
        </div>
        <div className="p-3 bg-red-100 rounded-xl">
          <FaTimesCircle className="w-6 h-6 text-red-600" />
        </div>
      </div>
    </div>
  )
}

export default SoldProperties