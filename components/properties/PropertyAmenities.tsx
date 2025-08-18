'use client'

import React from 'react'
import { 
  FaCar, 
  FaSnowflake, 
  FaDumbbell, 
  FaUtensils,
  FaDog,
  FaBicycle,
  FaFireExtinguisher
} from 'react-icons/fa6'
import { FaShieldAlt } from "react-icons/fa";
import { PiSwimmingPool } from 'react-icons/pi'

export const iconMap: Record<string, React.ElementType> = {
  FaCar: FaCar,
  FaSnowflake: FaSnowflake,
  FaDumbbell: FaDumbbell,
  FaUtensils: FaUtensils,
  FaDog: FaDog,
  FaBicycle: FaBicycle,
  FaFireExtinguisher: FaFireExtinguisher,
  FaShieldAlt: FaShieldAlt,
  PiSwimmingPool: PiSwimmingPool
};

type Props = {
  PropertyAmenities: {
    essential: {
      garage: boolean;
      air_conditioning: boolean;
      parking_space: boolean;
      security_system: boolean;
    }
    outdoor: {
      swimming_pool: boolean;
      garden: boolean;
      fire_safety: boolean;
      pet_friendly: boolean;
    }
  }
  AdditionalInfo: {
    type: string;
    condition: string;
    year_built: string;
    furnishing: string
  }
}

const PropertyAmenities = ({ PropertyAmenities, AdditionalInfo }: Props) => {
   
  // Hardcoded amenities with icons and names
  const amenitiesConfig = {
    essential: [
      { icon: "FaCar", name: "Garage", key: "garage" },
      { icon: "FaSnowflake", name: "Air Conditioning", key: "air_conditioning" },
      { icon: "FaCar", name: "Parking Space", key: "parking_space" },
      { icon: "FaShieldAlt", name: "Security System", key: "security_system" }
    ],
    outdoor: [
      { icon: "PiSwimmingPool", name: "Swimming Pool", key: "swimming_pool" },
      { icon: "FaBicycle", name: "Garden", key: "garden" },
      { icon: "FaFireExtinguisher", name: "Fire Safety", key: "fire_safety" },
      { icon: "FaDog", name: "Pet Friendly", key: "pet_friendly" }
    ]
  };

  const AmenityItem = ({ icon, name, available }: { icon: string; name: string; available: boolean }) => {
    const IconComponent = iconMap[icon]
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
        available 
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
          : 'bg-neutral-50 text-neutral-400 border border-neutral-200'
      }`}>
        <IconComponent className={`w-5 h-5 ${
          available ? 'text-emerald-600' : 'text-neutral-400'
        }`} />
        <span className={`font-normal ${
          available ? 'text-emerald-700' : 'text-neutral-400'
        }`}>
          {name}
        </span>
        {!available && (
          <span className="text-xs bg-neutral-200 text-neutral-500 px-2 py-1 rounded-full ml-auto">
            Not Available
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <h3 className="text-xl sm:text-2xl font-medium text-neutral-800 mb-6">Amenities & Features</h3>
      
      <div className="space-y-8">
        {/* Essential Amenities */}
        <div>
          <h4 className="text-base sm:text-lg font-medium text-neutral-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-600 rounded-full"></div>
            Essential Amenities
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {amenitiesConfig.essential.map((amenity, index) => (
              <AmenityItem 
                key={index} 
                icon={amenity.icon} 
                name={amenity.name} 
                available={PropertyAmenities.essential[amenity.key as keyof typeof PropertyAmenities.essential]}
              />
            ))}
          </div>
        </div>

        {/* Outdoor Amenities */}
        <div>
          <h4 className="text-base sm:text-lg font-medium text-neutral-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-secondary-500 rounded-full"></div>
            Outdoor & Recreation
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {amenitiesConfig.outdoor.map((amenity, index) => (
              <AmenityItem 
                key={index} 
                icon={amenity.icon} 
                name={amenity.name} 
                available={PropertyAmenities.outdoor[amenity.key as keyof typeof PropertyAmenities.outdoor]}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Additional Information */}
      <div className="mt-8 p-6 bg-gradient-to-r from-neutral-50 to-primary-50 rounded-xl">
        <h4 className="text-base sm:text-lg font-medium text-neutral-800 mb-3">Additional Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm capitalize text-neutral-600">
          <div>
            <span className="font-normal">Property Type:</span> {AdditionalInfo.type}
          </div>
          <div>
            <span className="font-normal">Year Built:</span> {AdditionalInfo.year_built || 'New'}
          </div>
          <div>
            <span className="font-normal">Condition:</span>  {AdditionalInfo.condition}
          </div>
          <div>
           <span className="font-normal">Furnishing:</span> {AdditionalInfo.furnishing}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyAmenities 