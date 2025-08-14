'use client'

import React from 'react'
import Property from './Property'
import useStore from '@/lib/store'

type Props = {
    properties: Property[]
}

const LoadingSkeleton = () => {
  return (
    <div className="flex flex-wrap gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="w-80 bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
          {/* Image skeleton */}
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          
          {/* Content skeleton */}
          <div className="p-6 space-y-4">
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            
            {/* Price skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            
            {/* Location skeleton */}
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            
            {/* Features skeleton */}
            <div className="flex gap-4">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
            </div>
            
            {/* Button skeleton */}
            <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

const PropertyContainer = ({ properties }: Props) => {

  const {loading } = useStore()

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
      <div className="flex w-full flex-wrap gap-6">
            {properties.map((property) => (
              <Property
                key={property.id}
                property={property}
              />
            ))}
     </div>
  )
}

export default PropertyContainer