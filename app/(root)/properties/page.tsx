
import { getProperties } from "@/lib/supabaseClient";
import React from "react";
import CollapsibleSearchBar from "@/components/CollapsibleSearchBar";
import { HiHome } from "react-icons/hi";
import Link from "next/link";
import PropertyContainer from "@/components/properties/PropertyContainer";
import Pagination from "@/components/Pagination";



export default async function PropertiesPage({searchParams}: {searchParams: Promise<{ [key: string]: string }>}) {
  const {status, type, location, minPrice, maxPrice, minSqFt, maxSqFt, bedroomCount, bathroomCount, condition,area,state,subcity,furnishing, page = "1"} = await searchParams;

  const ITEMS_PER_PAGE = 12;
  const currentPage = parseInt(page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const properties = await getProperties(
     100,
   { 
    status,
    type,
    location,
    minPrice : parseInt(minPrice || "0"),
    maxPrice : parseInt(maxPrice || "0"),
    minSqFt : parseInt(minSqFt || "0"),
    maxSqFt : parseInt(maxSqFt || "0"),
    bedroomCount : parseInt(bedroomCount || "0"),
    bathroomCount : parseInt(bathroomCount || "0"),
    condition,
    area,
    state,
    subcity,
    furnishing
  }
  );

  // Calculate pagination
  const totalProperties = properties.length;
  const totalPages = Math.ceil(totalProperties / ITEMS_PER_PAGE);
  const paginatedProperties = properties.slice(offset, offset + ITEMS_PER_PAGE);
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Search Bar Component */}
      <CollapsibleSearchBar  />

      {/* Properties Content - Right side 80% width */}
      <div className="w-full lg:w-[80%] bg-gray-50 p-4 md:p-6">
        {properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="mb-6">
              <HiHome className="w-24 h-24 mx-auto text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">No Properties Found</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              We couldn&apos;t find any properties matching your current search criteria. 
              Try adjusting your filters or browse our available properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/properties"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Clear All Filters
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        ) : (
       <>
         <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4">Properties</h1>
            <p className="text-gray-600 mb-5 ">Found {totalProperties} properties matching your criteria.</p>
            <PropertyContainer properties={paginatedProperties} />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  searchParams={{
                    status,
                    type,
                    location,
                    minPrice,
                    maxPrice,
                    minSqFt,
                    maxSqFt,
                    bedroomCount,
                    bathroomCount,
                    condition,
                    area,
                    state,
                    subcity,
                    furnishing
                  }}
                />
              </div>
            )}
        </div>
       </>
        )}
      </div>
    </main>
  );
}