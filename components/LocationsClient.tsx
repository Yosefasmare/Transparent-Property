'use client'

import React, { useEffect, useState } from 'react';
import { getLocations } from "@/lib/supabaseClient";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";
import LocationCard from './LocationCard';
import { location } from '@/lib/types';


const LocationsClient = () => {
  const [locations, setLocations] = useState<location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations(50); // Get more locations for the page
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
      const filtered = locations.filter(loc =>
        loc.loc_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchTerm, locations]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-accent-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 text-lg">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-accent-50 to-primary-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Explore Locations
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
            Discover amazing properties in the most sought-after locations across the city
          </p>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-neutral-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineSearch className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-accent-600 focus:border-transparent text-neutral-900 placeholder-neutral-500 transition-all duration-200"
                />
              </div>

              {/* Filter Button */}
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-colors duration-200">
                <HiOutlineFilter className="h-5 w-5" />
                <span>Filters</span>
              </button>

              {/* Results Count */}
              <div className="text-neutral-600 font-medium">
                {filteredLocations.length} of {locations.length} locations
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="pb-20 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-neutral-100">
                <HiOutlineSearch className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">No locations found</h3>
                <p className="text-neutral-600">Try adjusting your search terms or browse all locations.</p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-800 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  <span>View All Locations</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredLocations.map((loc) => (
                <LocationCard key={loc.id} loc={loc} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LocationsClient;
