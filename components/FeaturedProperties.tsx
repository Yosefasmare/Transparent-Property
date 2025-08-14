import { getProperties } from "@/lib/supabaseClient";

import { FiHome } from "react-icons/fi";
import PropertyContainer from "./properties/PropertyContainer";
import { HiOutlineArrowRight } from "react-icons/hi";
import Link from "next/link";


export default async function FeaturedProperties() {

  const properties = await getProperties(6);

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" id="featured">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Properties
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium properties in prime locations
          </p>
        </div>
        {
          (properties?.length === 0 || !properties) ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-blue-50 via-white to-pink-50 rounded-2xl shadow-xl mx-auto max-w-md border border-blue-100 ring-2 ring-pink-100 animate-fade-in">
              <FiHome size={56} className="mb-5 text-pink-400 animate-bounce-slow" />
              <h3 className="text-2xl font-extrabold text-pink-500 mb-2 tracking-tight drop-shadow">No Properties Found</h3>
              <p className="text-gray-500 text-base text-center mb-1">We couldn&apos;t find any properties at the moment.</p>
              <p className="text-gray-400 text-sm text-center">Please check back later or try adjusting your search criteria.</p>
            </div>
          ) :
              <PropertyContainer properties={properties} />
        }
    
      </div>
       <div className="text-center mt-16">
          <Link
          href={'/properties'}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <span>View All Properties</span>
            <HiOutlineArrowRight className="w-5 h-5" />
          </Link>
        </div>
    </section>
  );
} 