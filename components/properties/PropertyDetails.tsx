'use client'

import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { FaBed, FaBath, FaRulerCombined, FaLocationDot, FaHeart, FaShare, FaCalendar, FaSquareParking } from 'react-icons/fa6'

type Props = {
  PropertyInfo: {
    id:string,
    title: string
    price: number
    price_per: string
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
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [liked, setLiked] = useState<string[]>([]);
  const [showCopied, setShowCopied] = useState(false);


   useEffect(() => {
    const storedLikes = localStorage.getItem("likedProperties");
    if (storedLikes) {
      setLiked(JSON.parse(storedLikes));
    }
  }, []);

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

  const getPostedTime = (listedDate: string) => {
    if (!listedDate) return '';
    
    const now = new Date();
    const created = new Date(listedDate);
    const diffInMs = now.getTime() - created.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInDays > 0) {
      if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
      if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
      }
      if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} month${months === 1 ? '' : 's'} ago`;
      }
      const years = Math.floor(diffInDays / 365);
      return `${years} year${years === 1 ? '' : 's'} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just posted';
    }
  }

  
  const toggleLike = (id: string) => {
     let updated: string[];
     if(liked.includes(id)){
      updated = liked.filter(item => item != id)
     } else{
      updated = [...liked,id]
     }
    setLiked(updated);
    localStorage.setItem("likedProperties", JSON.stringify(updated));
  };
 
   const handleShare = async (e: React.MouseEvent) => {
     e.preventDefault();
     e.stopPropagation();
     
     try {
       const propertyUrl = `${window.location.origin}/properties/${PropertyInfo.id}`;
       await navigator.clipboard.writeText(propertyUrl);
       
       setShowCopied(true);
       setTimeout(() => setShowCopied(false), 2000);
     } catch (err) {
       console.error('Failed to copy URL:', err);
     }
   };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 break-words overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={` capitalize px-3 py-1 ${PropertyInfo.status === 'sale' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}  rounded-full text-sm font-normal`}>
              For {PropertyInfo.status}
            </span>
            <span className=" capitalize px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-normal border border-primary-200">
              {PropertyInfo.type}
            </span>
          </div>
          <h1 className=" capitalize text-xl sm:text-2xl lg:text-3xl font-medium text-neutral-800 mb-2">
            {PropertyInfo.title}
          </h1>
          <div className="flex items-center gap-2 text-neutral-600 text-sm">
            <FaLocationDot className="text-primary-700" />
            <span>{PropertyInfo.location}</span>
          </div>
          {/* Posted When Indicator */}
          <div className="flex items-center gap-2 text-neutral-600 text-sm mt-2">
            <FaCalendar className="text-primary-700" />
            <span>Posted {getPostedTime(PropertyInfo.listedDate)}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
              <div className="ml-auto flex gap-1.5">
                    <button
                      className="p-2.5 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-500 hover:text-rose-600 rounded-full transition-all duration-300 group/btn shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 border border-rose-200 hover:border-rose-300"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLike(PropertyInfo.id);
                      }}
                      aria-label="Like property"
                      type="button"
                    >
                      <FaHeart
                        size={18}
                        color={liked.includes(PropertyInfo.id) ? "#f43f5e" : "gray"}
                        className={`transition-all duration-300 cursor-pointer ${
                          liked.includes(PropertyInfo.id) ? "scale-110 drop-shadow-lg" : "scale-100"
                        }`}
                      />
                    </button>
                    <button
                      className="relative p-2.5 bg-gradient-to-r from-accent-50 to-accent-100 hover:from-accent-100 hover:to-accent-200 text-accent-600 hover:text-accent-700 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 border border-accent-200 hover:border-accent-300"
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

      {/* Price */}
      <div className="mb-6">
        <div className=" mb-2">
          <span className='text-2xl sm:text-3xl lg:text-4xl font-medium text-neutral-800'>{formatPrice(PropertyInfo.price)}</span><span className='text-md text-neutral-700'>/{PropertyInfo.price_per}</span>
        </div>
        <div className="flex items-center gap-2 text-neutral-600 text-sm">
          <FaCalendar className="text-primary-700" />
          <span>Listed on {formatDate(PropertyInfo.listedDate)}</span>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-neutral-50 rounded-xl">
          <FaBed className="text-xl sm:text-2xl text-accent-600 mx-auto mb-2" />
          <div className="text-lg sm:text-xl lg:text-2xl font-medium text-neutral-800">{PropertyInfo.bedrooms}</div>
          <div className="text-sm text-neutral-600">Bedrooms</div>
        </div>
        <div className="text-center p-4 bg-neutral-50 rounded-xl">
          <FaBath className="text-xl sm:text-2xl text-primary-700 mx-auto mb-2" />
          <div className="text-lg sm:text-xl lg:text-2xl font-medium text-neutral-800">{PropertyInfo.bathrooms}</div>
          <div className="text-sm text-neutral-600">Bathrooms</div>
        </div>
        <div className="text-center p-4 bg-neutral-50 rounded-xl">
          <FaRulerCombined className="text-xl sm:text-2xl text-secondary-600 mx-auto mb-2" />
          <div className="text-lg sm:text-xl lg:text-2xl font-medium text-neutral-800">{PropertyInfo.size.toLocaleString()}</div>
          <div className="text-sm text-neutral-600">Sq Ft</div>
        </div>
        <div className="text-center p-4 bg-neutral-50 rounded-xl">
          <FaSquareParking className="text-xl sm:text-2xl text-accent-600 mx-auto mb-2"  />
          <div className="text-lg sm:text-xl lg:text-2xl font-medium text-neutral-800">{PropertyInfo.parking}</div>
          <div className="text-sm text-neutral-600">Parking/Garages</div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 break-words">
        <h3 className="text-lg sm:text-xl font-medium text-neutral-800 mb-4">Description</h3>
        <div className="text-neutral-600 leading-relaxed text-base">
          {showFullDescription ? (
            <p>{PropertyInfo.description}</p>
          ) : (
            <p>
              {PropertyInfo.description.slice(0, 200)}...
            </p>
          )}
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-accent-600 hover:text-accent-700 font-normal mt-2 transition-colors duration-300 text-base"
          >
            {showFullDescription ? 'Show less' : 'Read more'}
          </button>
        </div>
      </div>

      {/* Features List */}
      <div>
        <h3 className="text-lg sm:text-xl font-medium text-neutral-800 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PropertyInfo.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
              <span className="text-neutral-600 text-base">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails 