'use client'

import React from 'react'
import { FaLocationDot, FaLocationArrow } from 'react-icons/fa6'
import Link from 'next/link'



type Props = {
  location: {
    area: string;
    state: string;
    country:string;
    latitude: number;
    longitude: number;
  }
}

const PropertyMap = ({ location }: Props) => {

 const address = [
  location.area,
  location.state,
  location.country
].filter(Boolean).join(', ');



  return (
    <div className="bg-white z-10 rounded-2xl shadow-lg p-8 overflow-x-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Location</h3>
        <Link
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors duration-300"
        >
          <FaLocationArrow className="text-indigo-500" />
          <span className="font-medium">Get Directions</span>
        </Link>
      </div>

      {/* Address */}
      <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
        <FaLocationDot className="text-indigo-500 mt-1 flex-shrink-0" />
        <div>
          <p className="text-gray-800 font-medium">{address}</p>
        </div>
      </div>
    </div>
  )
}

export default PropertyMap 