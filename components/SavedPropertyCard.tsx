'use client';

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaBath, FaBed, FaEye, FaShare, FaCheck, FaHeart } from "react-icons/fa6";
import { LuLandPlot } from "react-icons/lu";
import { PiMapPinAreaFill } from "react-icons/pi";
import { Property } from "@/lib/types";

interface SavedPropertyCardProps {
  property: Property;
  onRemove: (id: string) => void;
}

const SavedPropertyCard = ({ property, onRemove }: SavedPropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Br ${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `Br ${(price / 1000).toFixed(0)}K`;
    }
    return `Br ${price.toLocaleString()}`;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const propertyUrl = `${window.location.origin}/properties/${property.id}`;
      await navigator.clipboard.writeText(propertyUrl);
      
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const formatViews = (viewCount: number) => {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`
    }
    return viewCount.toString()
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-primary-200 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={property.image_paths[currentImageIndex] || property.image_paths[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-primary-800 to-primary-700 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
            {property.type}
          </span>
        </div>

        {/* Remove from saved button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(property.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-rose-500 hover:text-rose-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-10"
          aria-label="Remove from saved properties"
        >
          <FaHeart size={16} />
        </button>

        {/* View Property Overlay on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-medium text-base sm:text-lg shadow-2xl border border-white/20">
            View Property
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col justify-between h-[55%]">
        {/* Title and Price */}
        <div className="mb-3">
          <h3 className="font-semibold text-neutral-800 text-lg mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-2 text-neutral-600 text-sm mb-2">
            <PiMapPinAreaFill className="text-primary-500" />
            <span>{property.location.area}, {property.location.state}</span>
          </div>
          <p className="text-2xl font-bold text-primary-600 group-hover:text-primary-700 transition-colors">
            {formatPrice(property.price)}
          </p>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-4 text-neutral-600 text-sm mb-4">
          <div className="flex items-center gap-1">
            <FaBed className="text-primary-500" />
            <span>{property.beds} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBath className="text-primary-500" />
            <span>{property.baths} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <LuLandPlot className="text-primary-500" />
            <span>{property.size} sq ft</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-3 px-4 rounded-xl text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View Details
          </Link>
          <button
            onClick={handleShare}
            className="p-3 bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 text-secondary-600 hover:text-secondary-700 rounded-xl transition-all duration-300 group/btn shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 border border-secondary-200 hover:border-secondary-300"
            aria-label="Share property"
          >
            <FaShare size={16} />
          </button>
        </div>

        {/* Views and Status */}
        <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1">
            <FaEye size={12} />
            {property.views ? formatViews(property.views) : '0'} views
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'For Sale' ? 'bg-green-100 text-green-800' :
            property.status === 'For Rent' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {property.status}
          </span>
        </div>
      </div>

      {/* Share Success Message */}
      {showCopied && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-lg text-sm shadow-lg z-20">
          <div className="flex items-center gap-2">
            <FaCheck size={14} />
            Copied!
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPropertyCard;
