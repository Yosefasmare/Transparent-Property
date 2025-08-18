'use client'

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaHeart, FaBed, FaBath, FaRulerCombined, FaEye, FaShare, FaTrash, FaFilter, FaSort, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FaMapMarkerAlt } from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import Link from "next/link";
import { getSavedProperties } from "@/lib/supabaseClient";

// Define the Property type
interface Property {
  id: string;
  title: string;
  price: number;
  status: string;
  type: string;
  location: {
    area:string;
    state:string;
  };
  beds: number;
  baths: number;
  size: number;
  description: string;
  image_paths: string[];
  views: number;
}

export default function SavedPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const storedLikes = localStorage.getItem("likedProperties");
        if (storedLikes) {
          const savedIds = JSON.parse(storedLikes);
          
           const savedProperties = await getSavedProperties(savedIds)
          if(savedProperties){
            setProperties(savedProperties)
          }
          
        }
      } catch (error) {
        console.error('Error fetching saved properties:', error);
        setProperties([]);
      }
    };

    fetchSavedProperties();
  }, []); // Remove properties dependency to fix infinite loop

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage, setPropertiesPerPage] = useState(6);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Br ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `Br ${(price / 1000).toFixed(0)}K`;
    }
    return `Br ${price.toLocaleString()}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const removeProperty = (id: string) => {
    setProperties(prev => prev.filter(prop => prop.id !== id));
    // Remove from localStorage as well
    const storedLikes = localStorage.getItem("likedProperties");
    if (storedLikes) {
      const savedIds = JSON.parse(storedLikes);
      const updatedIds = savedIds.filter((savedId: string) => savedId !== id);
      localStorage.setItem("likedProperties", JSON.stringify(updatedIds));
    }
    
    // Reset to first page if current page becomes empty
    const totalPages = Math.ceil((properties.length - 1) / propertiesPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filterType === 'all') return true;
    if (filterType === 'sale') return property.status === 'For Sale';
    if (filterType === 'rent') return property.status === 'For Rent';
    return property.type.toLowerCase() === filterType;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      case 'recent':
        return parseInt(b.id) - parseInt(a.id);
      case 'views':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedProperties.length / propertiesPerPage);
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = sortedProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, sortBy]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [] as Array<number | string>;
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-accent-50 to-secondary-50 pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 sm:pt-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full mb-4 sm:mb-6">
            <IoBookmark className="text-white text-2xl sm:text-3xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-neutral-800 mb-2 sm:mb-3">
            Your Saved Properties
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg max-w-2xl mx-auto px-2">
            Keep track of all the properties you&apos;ve liked and saved for future reference
          </p>
          <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-neutral-500">
            {properties.length} property{properties.length !== 1 ? 'ies' : 'y'} saved
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col gap-4">
            {/* Filter Options */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  filterType === 'all'
                    ? 'bg-primary-700 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('sale')}
                className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  filterType === 'sale'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Sale
              </button>
              <button
                onClick={() => setFilterType('rent')}
                className={`px-3 sm:px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                  filterType === 'rent'
                    ? 'bg-accent-600 text-white shadow-lg'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Rent
              </button>
            </div>

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-neutral-300 rounded-xl text-neutral-600 focus:ring-2 focus:ring-primary-700 focus:border-transparent text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="views">Most Viewed</option>
                </select>

                <div className="flex bg-neutral-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white text-primary-700 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white text-primary-700 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Properties per page selector */}
              <select
                value={propertiesPerPage}
                onChange={(e) => {
                  setPropertiesPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-neutral-300 rounded-xl text-neutral-600 focus:ring-2 focus:ring-primary-700 focus:border-transparent text-sm"
              >
                <option value={6}>6 per page</option>
                <option value={9}>9 per page</option>
                <option value={12}>12 per page</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {currentProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoBookmark className="text-4xl text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium text-neutral-700 mb-2">No Saved Properties</h3>
            <p className="text-neutral-500 mb-6">Start exploring and save properties you like!</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white font-medium rounded-xl hover:bg-primary-800 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6' : 'space-y-4'}>
              {currentProperties.map((property) => (
                <div
                  key={property.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                    viewMode === 'list' ? 'flex flex-col sm:flex-row' : 'flex flex-col'
                  }`}
                >
                  {/* Image Section */}
                  <div className={`relative ${viewMode === 'list' ? 'w-full sm:w-80 h-48 sm:h-64' : 'h-48 sm:h-64'}`}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/property-images/${property.image_paths[0]}`}
                      alt={property.title}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                        property.status === 'For Sale' 
                          ? 'bg-emerald-600' 
                          : 'bg-accent-600'
                      }`}>
                        {property.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2">
                      <button className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-white transition-colors">
                        <FaEye className="text-neutral-600 text-xs sm:text-sm" />
                      </button>
                      <button className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-white transition-colors">
                        <FaShare className="text-neutral-600 text-xs sm:text-sm" />
                      </button>
                      <button 
                        onClick={() => removeProperty(property.id)}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-red-50 transition-colors"
                      >
                        <FaTrash className="text-red-500 text-xs sm:text-sm" />
                      </button>
                    </div>

                    {/* Heart Icon */}
                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg">
                        <FaHeart className="text-rose-500 text-base sm:text-lg" />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className={`p-4 sm:p-6 flex-1 flex flex-col ${viewMode === 'list' ? 'ml-0' : ''}`}>
                    {/* Property Type */}
                    <div className="mb-3">
                      <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2 sm:px-3 py-1 rounded-full border border-primary-200">
                        {property.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-medium text-neutral-800 mb-2 line-clamp-2">
                      {property.title}
                    </h3>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-neutral-600 mb-3 sm:mb-4">
                      <FaMapMarkerAlt className="text-primary-700 text-sm sm:text-base" />
                      <span className="text-xs sm:text-sm">{`${property.location.area},${property.location.state}`}</span>
                    </div>

                    {/* Property Details */}
                    <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-neutral-600">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaBed className="text-accent-600 text-sm sm:text-base" />
                        <span>{property.beds} beds</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaBath className="text-primary-700 text-sm sm:text-base" />
                        <span>{property.baths} baths</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FaRulerCombined className="text-secondary-600 text-sm sm:text-base" />
                        <span>{property.size} m²</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-neutral-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {property.description}
                    </p>

                    {/* Price and Views */}
                    <div className="mt-auto flex items-center justify-between">
                      <div>
                        <div className="text-lg sm:text-2xl font-medium text-neutral-800">
                          {formatPrice(property.price)}
                        </div>
                        {property.status === 'For Rent' && (
                          <div className="text-xs sm:text-sm text-neutral-600">per month</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs sm:text-sm text-neutral-600">{formatViews(property.views)} views</div>
                      </div>
                    </div>

                    {/* View Property Button */}
                    <Link
                      href={`/properties/${property.id}`}
                      className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-primary-800 to-primary-700 text-white font-medium py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl text-center hover:from-primary-900 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                    >
                      View Property
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-xs sm:text-sm text-neutral-600 text-center sm:text-left">
                  Showing {indexOfFirstProperty + 1} to {Math.min(indexOfLastProperty, sortedProperties.length)} of {sortedProperties.length} properties
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                      currentPage === 1
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      <React.Fragment key={index}>
                        {page === '...' ? (
                          <span className="px-2 sm:px-3 py-1.5 sm:py-2 text-neutral-400 text-xs sm:text-sm">...</span>
                        ) : (
                          <button
                            onClick={() => handlePageChange(page as number)}
                            className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                              currentPage === page
                                ? 'bg-primary-700 text-white shadow-lg'
                                : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            {page}
                          </button>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State (if all properties are removed) */}
        {properties.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoBookmark className="text-4xl text-neutral-400" />
            </div>
            <h3 className="text-xl font-medium text-neutral-700 mb-2">All Properties Removed</h3>
            <p className="text-neutral-500 mb-6">You&apos;ve removed all your saved properties.</p>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white font-medium rounded-xl hover:bg-primary-800 transition-colors"
            >
              Discover New Properties
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}