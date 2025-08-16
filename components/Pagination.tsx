'use client'

import React from 'react'
import Link from 'next/link'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface PaginationProps {
  currentPage: number
  totalPages: number
  searchParams: {
    status?: string
    type?: string
    location?: string
    minPrice?: string
    maxPrice?: string
    minSqFt?: string
    maxSqFt?: string
    bedroomCount?: string
    bathroomCount?: string
    condition?: string
    area?: string
    state?: string
    subcity?: string
    furnishing?: string
  }
}

const Pagination = ({ currentPage, totalPages, searchParams }: PaginationProps) => {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    
    // Add search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value !== '0') {
        params.append(key, value)
      }
    })
    
    // Add page parameter
    if (page > 1) {
      params.append('page', page.toString())
    }
    
    const queryString = params.toString()
    return `/properties${queryString ? `?${queryString}` : ''}`
  }

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
        >
          <FaChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-400">...</span>
            ) : (
              <Link
                href={buildUrl(page as number)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  page === currentPage
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                }`}
              >
                {page}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
        >
          Next
          <FaChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

export default Pagination
