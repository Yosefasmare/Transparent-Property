'use client'

import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import { FaChevronLeft, FaChevronRight, FaExpand, FaPause, FaPlay } from 'react-icons/fa6'

type Props = {
  propertyImagePaths: string[]
}

const PropertyGallery = ({ propertyImagePaths }: Props) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  // Auto-rotate images
  useEffect(() => {
    if (!isAutoPlaying || isHovered || isFullscreen) return

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % propertyImagePaths.length)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, isHovered, isFullscreen, propertyImagePaths.length])

  const nextImage = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % propertyImagePaths.length)
  }, [propertyImagePaths.length])

  const prevImage = useCallback(() => {
    setCurrentImage((prev) => (prev - 1 + propertyImagePaths.length) % propertyImagePaths.length)
  }, [propertyImagePaths.length])

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFullscreen) {
      switch (e.key) {
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
        case 'Escape':
          setIsFullscreen(false)
          break
        case ' ':
          e.preventDefault()
          toggleAutoPlay()
          break
      }
    }
  }, [isFullscreen, prevImage, nextImage, toggleAutoPlay])

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen, handleKeyDown])

  const goToImage = (index: number) => {
    setCurrentImage(index)
    // Pause auto-play briefly when manually selecting an image
    if (isAutoPlaying) {
      setIsAutoPlaying(false)
      setTimeout(() => setIsAutoPlaying(true), 3000)
    }
  }

  return (
    <div 
      className="relative overflow-hidden rounded-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {/* Image with smooth transitions */}
        <div className="relative w-full h-full">
          {propertyImagePaths.map((imagePath, index) => (
            <Image
              key={index}
              src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/property-images/${imagePath}`}
              alt={`Property ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
              placeholder='blur'
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSk..." 
              width={800}
              height={500}
              priority={index === 0}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/50 z-10"
        >
          <FaChevronLeft className="text-gray-800" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/50 z-10"
        >
          <FaChevronRight className="text-gray-800" />
        </button>

        {/* Control Buttons */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {/* Auto-play Toggle */}
          <button
            onClick={toggleAutoPlay}
            className="w-10 h-10 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/50"
            title={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
          >
            {isAutoPlaying ? (
              <FaPause className="text-gray-800" />
            ) : (
              <FaPlay className="text-gray-800" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="w-10 h-10 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/50"
            title="Enter fullscreen"
          >
            <FaExpand className="text-gray-800" />
          </button>
        </div>

        {/* Enhanced Image Counter */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 z-10">
          {currentImage + 1} / {propertyImagePaths.length}
        </div>

        {/* Progress Bar */}
        {isAutoPlaying && (
          <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full z-10">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ 
                width: `${((currentImage + 1) / propertyImagePaths.length) * 100}%` 
              }}
            />
          </div>
        )}
      </div>

      {/* Enhanced Thumbnail Strip */}
      <div className="bg-white p-4 border-t border-gray-100">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {propertyImagePaths.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 ${
                currentImage === index
                  ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/property-images/${image}`}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                placeholder='blur'
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSk..." 
                width={96}
                height={80}
              />
            
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            {/* Fullscreen Image */}
            <div className="relative">
              {propertyImagePaths.map((imagePath, index) => (
                <Image
                  key={index}
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/property-images/${imagePath}`}
                  alt={`Property ${index + 1}`}
                  className={`max-w-full max-h-full object-contain transition-opacity duration-1000 ${
                    index === currentImage ? 'opacity-100' : 'opacity-0'
                  }`}
                  width={1920}
                  height={1080}
                  placeholder='blur'
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSk..." 
                />
              ))}
            </div>
            
            {/* Fullscreen Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={toggleAutoPlay}
                className="w-12 h-12 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/50"
                title={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
              >
                {isAutoPlaying ? (
                  <FaPause className="text-gray-800" />
                ) : (
                  <FaPlay className="text-gray-800" />
                )}
              </button>
              
              <button
                onClick={() => setIsFullscreen(false)}
                className="w-12 h-12 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/50"
                title="Exit fullscreen"
              >
                <FaExpand className="text-gray-800 rotate-45" />
              </button>
            </div>
            
            {/* Fullscreen Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/50"
            >
              <FaChevronLeft className="text-gray-800 text-xl" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/50"
            >
              <FaChevronRight className="text-gray-800 text-xl" />
            </button>

            {/* Fullscreen Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-full text-lg font-medium border border-white/20">
              {currentImage + 1} / {propertyImagePaths.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyGallery 