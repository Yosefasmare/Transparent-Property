'use client'

import React, { useState } from 'react'
import { FaBed, FaBath, FaRulerCombined, FaLocationDot, FaHeart, FaShare, FaCalendar, FaSquareParking } from 'react-icons/fa6'

type Props = {
  PropertyInfo: {
    title: string
    price: number
    status: string
    type: string
    location: string
    listedDate: string
    parking: string;
    bedrooms: number
    bathrooms: number
    size: number
    description: string
    features: string[]
  }
}

const PropertyDetails = ({ PropertyInfo }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Property link copied to clipboard!')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={` capitalize px-3 py-1 bg-green-100 ${PropertyInfo.status === 'sale' ? 'bg-green-100 text-red-700' : 'bg-red-200 text-green-700'}  rounded-full text-sm font-medium`}>
              For {PropertyInfo.status}
            </span>
            <span className=" capitalize px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
              {PropertyInfo.type}
            </span>
          </div>
          <h1 className=" capitalize text-3xl font-bold text-gray-800 mb-2">
            {PropertyInfo.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FaLocationDot className="text-indigo-500" />
            <span>{PropertyInfo.location}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-xl transition-all duration-300 ${
              isFavorite
                ? 'bg-red-50 text-red-500 border border-red-200'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            }`}
          >
            <FaHeart className={isFavorite ? 'fill-current' : ''} />
          </button>
          <button onClick={()=>handleShare()} className="p-3 rounded-xl bg-gray-50 text-gray-600 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-300">
            <FaShare />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {formatPrice(PropertyInfo.price)}
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <FaCalendar className="text-indigo-500" />
          <span>Listed on {formatDate(PropertyInfo.listedDate)}</span>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <FaBed className="text-2xl text-indigo-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{PropertyInfo.bedrooms}</div>
          <div className="text-sm text-gray-600">Bedrooms</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <FaBath className="text-2xl text-indigo-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{PropertyInfo.bathrooms}</div>
          <div className="text-sm text-gray-600">Bathrooms</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <FaRulerCombined className="text-2xl text-indigo-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-800">{PropertyInfo.size.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Sq Ft</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <FaSquareParking className="text-2xl text-indigo-500 mx-auto mb-2"  />
          <div className="text-2xl font-bold text-gray-800">{PropertyInfo.parking}</div>
          <div className="text-sm text-gray-600">Parking/Garages</div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
        <div className="text-gray-600 leading-relaxed">
          {showFullDescription ? (
            <p>{PropertyInfo.description}</p>
          ) : (
            <p>
              {PropertyInfo.description.slice(0, 200)}...
            </p>
          )}
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-indigo-600 hover:text-indigo-700 font-medium mt-2 transition-colors duration-300"
          >
            {showFullDescription ? 'Show less' : 'Read more'}
          </button>
        </div>
      </div>

      {/* Features List */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PropertyInfo.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails 