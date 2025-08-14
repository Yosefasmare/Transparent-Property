'use client'

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBath, FaBed, FaHeart, FaEye, FaShare, FaCheck } from "react-icons/fa6";
import { LuLandPlot } from "react-icons/lu";
import { PiMapPinAreaFill } from "react-icons/pi";

interface PropertyProps {
  property: {
    id: string;
    image_paths: string[];
    title: string;
    status: string;
    type: string;
    location: {
      area: string;
      state: string;
    };
    beds: number;
    baths: number;
    size: number;
    price: number;
    views?: number;
  };
}

const Property = ({ property }: PropertyProps) => {

  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});
  const [isHovered, setIsHovered] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Debug logging to see what's in the property object
  useEffect(() => {
    console.log('Property object:', property);
    console.log('Property price:', property.price);
    console.log('Property price type:', typeof property.price);
  }, [property]);

  useEffect(() => {
    const storedLikes = localStorage.getItem("likedProperties");
    if (storedLikes) {
      setLiked(JSON.parse(storedLikes));
    }
  }, []);

  // Auto-rotate images if there are multiple images
  useEffect(() => {
    if (property.image_paths.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === property.image_paths.length - 1 ? 0 : prev + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [property.image_paths.length]);

  const toggleLike = (id: string) => {
     const updated = {
      ...liked,
      [id]: !liked[id],
    };
    setLiked(updated);
    localStorage.setItem("likedProperties", JSON.stringify(updated));
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

  const FormatPrice = (price: number) =>{
    return new Intl.NumberFormat('en-US').format(price);
  }
  
  const DepricatedTiltle = (title: string) => {
    return title.length > 30 ? `${title.slice(0, 30)}...` : title;
  }

  const formatViews = (viewCount: number) => {
    if (viewCount >= 1000000) {
      return `${(viewCount / 1000000).toFixed(1)}M`
    } else if (viewCount >= 1000) {
      return `${(viewCount / 1000).toFixed(1)}K`
    }
    return viewCount.toString()
  }

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group relative flex flex-col bg-white h-[540px] w-[380px] rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-3 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container with Enhanced Overlay */}
      <div className="relative h-[40%] overflow-hidden">
        {/* Image Carousel */}
        <div className="relative w-full h-full">
          {property.image_paths.map((imagePath, index) => (
            <Image
              key={index}
              src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/property-images/${imagePath}`}
              alt={`${property.title} - Image ${index + 1}`}
              width={400}
              height={200}
              priority={index === 0}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-110 transition-transform duration-700`}
            />
          ))}
        </div>
        
        {/* Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge with Enhanced Design */}
        <span
          className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm transition-all duration-300 z-10 tracking-wide border-2 ${
            property.status.toLocaleLowerCase() === "sale"
              ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-200/50"
              : "bg-rose-500 text-white border-rose-400 shadow-rose-200/50"
          }`}
        >
          {property.status.toLocaleLowerCase() === "sale" ? "For Sale" : "For Rent"}
        </span>

        {/* Enhanced Views Counter */}
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50">
            <FaEye className="text-blue-600 text-sm" />
            <span className="text-sm font-bold text-gray-800">{formatViews(property.views!)}</span>
          </div>
        </div>

        {/* Image Indicators */}
        {property.image_paths.length > 1 && (
          <div className="absolute bottom-4 left-4 z-10 flex gap-1.5">
            {property.image_paths.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 scale-100'
                }`}
              />
            ))}
          </div>
        )}

        {/* View Property Overlay on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-black/70 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-2xl border border-white/20">
            View Property
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="h-[55%] p-4 flex flex-col justify-between">
        {/* Type Badge and Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
            {property.type}
          </span>
          <div className="ml-auto flex gap-1.5">
            <button
              className="p-2.5 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-500 hover:text-rose-600 rounded-full transition-all duration-300 group/btn shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 border border-rose-200 hover:border-rose-300"
              onClick={(e) => {
                e.preventDefault();
                toggleLike(property.id);
              }}
              aria-label="Like property"
              type="button"
            >
              <FaHeart
                size={18}
                color={liked[property.id] ? "#f43f5e" : "gray"}
                className={`transition-all duration-300 cursor-pointer ${
                  liked[property.id] ? "scale-110 drop-shadow-lg" : "scale-100"
                }`}
              />
            </button>
            <button
              className="relative p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-500 hover:text-blue-600 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 border border-blue-200 hover:border-blue-300"
              aria-label="Share property"
              type="button"
              onClick={handleShare}
            >
              {showCopied ? (
                <FaCheck size={16} className="text-green-600" />
              ) : (
                <FaShare size={16} />
              )}
              {/* Copy Success Tooltip */}
              {showCopied && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-20">
                  Copied!
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Title */}
        <h3 className="text-lg capitalize font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
          {DepricatedTiltle(property.title)}
        </h3>

        {/* Enhanced Location */}
        <p className="text-gray-600 text-sm capitalize mb-3 flex items-center gap-2">
          <PiMapPinAreaFill className="text-blue-600 text-base" />
          <span className="font-medium">{property.location.area}, {property.location.state}</span>
        </p>

        {/* Enhanced Property Details */}
        <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
          {/* Beds */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-full">
              <FaBed className="text-blue-600 text-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-800">{property.beds}</span>
              <span className="text-xs text-gray-500 font-medium">Beds</span>
            </div>
          </div>
          
          {/* Baths */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 rounded-full">
              <FaBath className="text-indigo-600 text-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-800">{property.baths}</span>
              <span className="text-xs text-gray-500 font-medium">Baths</span>
            </div>
          </div>
          
          {/* Size */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-full">
              <LuLandPlot className="text-purple-600 text-sm" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-800">{property.size}</span>
              <span className="text-xs text-gray-500 font-medium">sqm(m²)</span>
            </div>
          </div>
        </div>

        {/* Enhanced Price and CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="flex-1">
            <div className="mb-1">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                {property.status.toLowerCase() === "sale" ? "Price" : "Monthly Rent"}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-400 font-medium">Br</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent text-blue-600">
                {property.price ? FormatPrice(property.price) : 'Contact Us'}
              </span>
              {property.status.toLowerCase() === "rent" && property.price && (
                <span className="text-sm text-gray-500 font-medium">/month</span>
              )}
            </div>
            {property.status.toLowerCase() === "rent" && (
              <div className="mt-1">
                <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                  Available Now
                </span>
              </div>
            )}
            {property.status.toLowerCase() === "sale" && (
              <div className="mt-1">
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                  Ready to Move In
                </span>
              </div>
            )}
          </div>
          
          <div className="ml-3">
            <div className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl text-xs transition-all duration-300 transform hover:scale-105 active:scale-95 border border-blue-500/20">
              View Details
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-300/30 transition-all duration-500 pointer-events-none" />
    </Link>
  )
}

export default Property