'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight, FaMagnifyingGlass, FaSpinner } from 'react-icons/fa6'
import { fetchSimilarProperties } from '@/lib/supabaseClient'
import Property from './Property'

type Props = {
  CurrentProperty: {
    id: string;
    type: string;
    price: number;
    location : {
      area: string;
      state: string;
    }
  }
}

type Property = {
  id: string;
  image_paths: string[];
  price: number;
  title: string;
   location: {
      area: string;
      state: string;
      };
  type: string;
  status: string;
  beds: number;
  baths: number;
  size: number;
};
const SimilarProperties = ({ CurrentProperty }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const [similarProperties, setSimilarProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const fetchSproperties = async () => {
        try {
           const data = await fetchSimilarProperties(CurrentProperty)
           setSimilarProperties(data)
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
    }
    fetchSproperties()
  },[CurrentProperty])



  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(similarProperties.length / 3))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(similarProperties.length / 3)) % Math.ceil(similarProperties.length / 3))
  }

  const visibleProperties = similarProperties.slice(currentIndex * 3, (currentIndex + 1) * 3)

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-2">Similar Properties</h2>
            <p className="text-gray-600">Discover other properties you might like</p>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors duration-300"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors duration-300"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>

        {visibleProperties.length === 0 && !loading  ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <FaMagnifyingGlass className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">No Similar Properties Found</h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              We couldn&apos;t find any properties similar to this one. Try adjusting your search criteria or browse our full collection.
            </p>
          </div>
        ): 
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <FaSpinner className="text-2xl text-white animate-spin" />
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-2">Finding Similar Properties</h3>
            <p className="text-gray-500 text-center max-w-md">
              We&apos;re searching for properties that match your criteria. This won&apos;t take long.
            </p>
          </div>
        ):(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProperties.map((property) => (
              <Property
               key={property.id}
               property={property}
                />
            ))}
          </div>

        )}
     </div>
        }

        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Properties
            <FaChevronRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SimilarProperties 