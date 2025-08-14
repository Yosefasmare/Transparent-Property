'use client'
import useStore from '@/lib/store';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const propertyConditions = ["New", "Used", "Under Construction", "Renovated"];
const propertyTypes = [
  "House",
  "Apartment",
  "Villa",
  "Condominium",
  "Townhouse",
  "Duplex",
  "Studio",
  "Land",
  "Commercial",
  "Office",
  "Warehouse",
  "Retail",
  "Industrial",
  "Farm",
  "Hotel",
  "Co-working Space",
  "Penthouse",
  "Cottage",
  "Bungalow"
];

const Searchbar = () => {
  const [condition,setCondition] = useState("")
  const [status, setStatus] = useState("All");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const {loading , setLoading} = useStore();

  const router = useRouter();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== "All") {
        params.append("status", status);
      }
      if (propertyType !== "") {
        params.append("type", propertyType);
      }
      if (location !== "") {
        params.append("street", location);
      } if(condition !== ""){
        params.append("condition", condition)
      }
      if (params.toString()) {
         router.push(`/properties/?${params.toString()}`);
      } 
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setStatus("All");
    setPropertyType("");
    setLocation("");
    router.push('/');
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!loading) {
          await handleSearch();
        }
      }}
      className="relative mt-7 bg-white/90 rounded-xl shadow-lg p-4 md:p-6 flex flex-col gap-3 items-stretch backdrop-blur "
    >
      {/* Rent/Buy Chooser absolutely positioned at top left */}
      <div className="absolute -mt-18 left-0 md:left-4 top-4 z-10">
        <div className="inline-flex rounded-full bg-gray-100 p-1 shadow-inner border border-gray-200">
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm md:text-base ${status === "All" ? "bg-indigo-600 text-white shadow" : "text-gray-700 hover:bg-indigo-50"}`}
            onClick={() => setStatus("All")}
            disabled={loading}
          >
            All
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm md:text-base ${status === "Rent" ? "bg-indigo-600 text-white shadow" : "text-gray-700 hover:bg-indigo-50"}`}
            onClick={() => setStatus("Rent")}
            disabled={loading}
          >
            Rent
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm md:text-base ${status === "Buy" ? "bg-indigo-600 text-white shadow" : "text-gray-700 hover:bg-indigo-50"}`}
            onClick={() => setStatus("Buy")}
            disabled={loading}
          >
            Buy
          </button>
        </div>
      </div>
      {/* Add padding top and left to avoid overlap with absolute chooser */}
      <div className="overflow-hidden p-2 ">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch">
          {/* Property Type */}
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full md:w-auto px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-700"
            disabled={loading}
          >
            <option value={""}>Property Type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {/* Location */}
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g., Addis Ababa)"
            className="w-full md:w-auto px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-700"
            disabled={loading}
          />
          {/* Price Range */}
         <select onChange={e=>setCondition(e.target.value)} value={condition} className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-gray-700">
                <option value="">Property Condition</option>
                {propertyConditions.map((condition) => (
                  <option key={condition} value={condition.toLocaleLowerCase()}>{condition}</option>
                ))}
              </select>
          {/* Search Button */}
          <button
            type="submit"
            className="w-full cursor-pointer md:w-auto px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            )}
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="w-full cursor-pointer md:w-auto px-6 py-2 rounded-md bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};

export default Searchbar;