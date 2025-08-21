'use client';

import { useEffect, useState } from 'react';
import { FaHeart, FaBookmark, FaHome, FaSadTear } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi';
import Link from 'next/link';
import SavedPropertyCard from './SavedPropertyCard';
import { getSavedProperties } from '@/lib/supabaseClient';
import { Property as PropertyType } from '@/lib/types';

export default function SavedPropertiesClient() {
  const [savedProperties, setSavedProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        // Read saved property IDs from localStorage
        const savedIds = localStorage.getItem('likedProperties');
        
        if (!savedIds) {
          setSavedProperties([]);
          setLoading(false);
          return;
        }

        const parsedIds = JSON.parse(savedIds);
        
        if (!Array.isArray(parsedIds) || parsedIds.length === 0) {
          setSavedProperties([]);
          setLoading(false);
          return;
        }

        // Fetch the actual property data from Supabase
        const properties = await getSavedProperties(parsedIds);
        
        if (properties) {
          setSavedProperties(properties);
        } else {
          setSavedProperties([]);
        }
      } catch (err) {
        console.error('Error fetching saved properties:', err);
        setError('Failed to load saved properties');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  const removeFromSaved = (propertyId: string) => {
    const updatedProperties = savedProperties.filter(p => p.id !== propertyId);
    setSavedProperties(updatedProperties);
    
    // Update localStorage
    const savedIds = localStorage.getItem('likedProperties');
    if (savedIds) {
      const parsedIds = JSON.parse(savedIds);
      const updatedIds = parsedIds.filter((id: string) => id !== propertyId);
      localStorage.setItem('likedProperties', JSON.stringify(updatedIds));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600 text-lg">Loading your saved properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <FaSadTear size={64} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-neutral-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (savedProperties.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaBookmark size={80} className="text-neutral-300" />
            <FaHeart size={40} className="text-neutral-300 absolute -top-2 -right-2" />
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-neutral-800 mb-4">No Saved Properties Yet</h3>
        <p className="text-neutral-600 text-lg mb-8 max-w-md mx-auto">
          Start exploring our properties and save the ones you like by clicking the heart icon!
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <FaHome size={20} />
          <span>Browse Properties</span>
          <HiOutlineArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with count */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-semibold text-neutral-800 mb-4">
          You have {savedProperties.length} saved propert{savedProperties.length === 1 ? 'y' : 'ies'}
        </h2>
        <p className="text-neutral-600 text-lg">
          Click the heart icon on any property card to remove it from your saved list
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {savedProperties.map((property: PropertyType) => (
          <div key={property.id}>
            <SavedPropertyCard property={property} onRemove={removeFromSaved} />
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <Link
          href="/properties"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 text-white font-medium px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <span>Discover More Properties</span>
          <HiOutlineArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
