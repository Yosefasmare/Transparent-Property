'use client'

import { getLocations } from "@/lib/supabaseClient";
import React, { useEffect, useState } from "react";
import { HiOutlineArrowRight, HiOutlineSearch } from "react-icons/hi";
import LocationCard from "./LocationCard";
import Link from "next/link";

export default function ExploreByLocation() {
  const [locations, setLocations] = useState<location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations(8);
        if (data) {
          setLocations(data);
          setFilteredLocations(data);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Filter locations based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLocations(locations);
    } else {
      const filtered = locations.filter(loc => {
        const searchLower = searchTerm.toLowerCase();
        
        // Search in multiple fields
        return (
          // Search in location name
          loc.loc_name?.toLowerCase().includes(searchLower) ||
          // Search in city if available
          (loc as location).loc_city?.toLowerCase().includes(searchLower) ||
          // Search in subcity if available
          (loc as location).loc_subcity?.toLowerCase().includes(searchLower) ||
          // Search in area if available
          (loc as location).loc_name?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" id="explore">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Explore by Location
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover amazing properties in the most sought-after locations across the city
            </p>
          </div>

          {/* Loading State */}
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">Loading locations...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" id="explore">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section with Search */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Explore by Location
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Discover amazing properties in the most sought-after locations across the city
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by area, state, city, or location name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 shadow-sm"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-2">
                {filteredLocations.length} of {locations.length} locations found
              </p>
            )}
          </div>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredLocations.map((loc) => (
            <LocationCard key={loc.id} loc={loc} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link
          href={'/locations'}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <span>View All Locations</span>
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
} 