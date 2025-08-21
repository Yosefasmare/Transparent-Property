import { Suspense } from 'react';
import { FaHeart, FaBookmark } from 'react-icons/fa';
import SavedPropertiesClient from '@/components/SavedPropertiesClient';

export const revalidate = 60; // re-fetch from Supabase every 60 seconds

export default function SavedPropertiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-pink-50">
      <main className="flex flex-col gap-0">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <FaBookmark size={64} className="text-secondary-600" />
                <FaHeart size={32} className="text-rose-500 absolute -top-2 -right-2" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-800 mb-6 tracking-tight">
              Your Saved Properties
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover and manage all the properties you&apos;ve liked and saved for future reference
            </p>
          </div>
        </section>

        {/* Saved Properties Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<SavedPropertiesSkeleton />}>
              <SavedPropertiesClient />
            </Suspense>
          </div>
        </section>
      </main>
    </div>
  );
}

// Loading skeleton for the saved properties
function SavedPropertiesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 