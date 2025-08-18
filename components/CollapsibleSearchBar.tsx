"use client";

import useStore from "@/lib/store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


const bedrooms = [1, 2, 3, 4, 5, "5+"];
const bathrooms = [1, 2, 3, 4, "4+"];
const propertyStatus = ["Sale", "Rent"];
const propertyConditions = ["New", "Used", "Under Construction", "Renovated"];
const PropertyFurnishing = ["Furnished", "Semi-Furnished", "Unfurnished"]
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

export default function CollapsibleSearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [status, setStatus] = useState("All");
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSqFt, setMinSqFt] = useState("");
  const [maxSqFt, setMaxSqFt] = useState("");
  const [bedroomCount, setBedroomCount] = useState("");
  const [bathroomCount, setBathroomCount] = useState("");
  const [condition, setCondition] = useState("");
  const [furnishing,setFurnishing] = useState("")

  const params = new URLSearchParams();
  const router = useRouter();

  const {loading, setLoading} = useStore();

  const handleSearch = () => {
        setLoading(true);
        if(status !== "All") {
          params.set("status", status);
        }
        if(propertyType !== "") {
          params.set("type", propertyType);
        }
        if(location !== "") {
          params.set("location", location);
        }
        if(minPrice !== "") {
          params.set("minPrice", minPrice);
        }
        if(maxPrice !== "") {
          params.set("maxPrice", maxPrice);
        }
       if(maxPrice !== "") {
          params.set("maxPrice", maxPrice);
        }
        if(minSqFt !== "") {
          params.set("minSqFt", minSqFt);
        }
        if(maxSqFt !== "") {
          params.set("maxSqFt", maxSqFt);
        }
        if(bedroomCount !== "") {
          params.set("bedroomCount", bedroomCount);
        }
        if(bathroomCount !== "") {
          params.set("bathroomCount", bathroomCount);
        }
        if(condition !== "") {
          params.set("condition", condition);
        } if(furnishing !== ""){
          params.set("furnishing",furnishing.toLowerCase())
        }

        router.push(`/properties?${params.toString()}`);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }

  return (
    <>
      {/* Mobile Search Toggle Button */}
      <div className="lg:hidden bg-white border-b border-neutral-200 p-4">
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="w-full flex items-center justify-between px-4 py-2 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors"
        >
          <span>{isSearchOpen ? 'Hide Filters' : 'Show Filters'}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isSearchOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Search Bar - Collapsible on mobile, fixed on desktop */}
      <div className={`
        w-full lg:w-[20%] bg-white border-r border-neutral-200 
        lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto
        ${isSearchOpen ? 'block' : 'hidden lg:block'}
        transition-all duration-300 ease-in-out
      `}>
        <div className="p-4 md:p-6">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-6 text-center lg:text-left">Browse Properties</h1>
          <form onSubmit={(e)=>{
            e.preventDefault();
            handleSearch();
          }} className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-neutral-700 mb-2">Filter Properties</h2>
            
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Property Type</label>
              <select onChange={e=>setPropertyType(e.target.value)} value={propertyType} className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700">
                <option value="">All Types</option>
                {propertyTypes.map((type) => (
                  <option  key={type} value={type.toLocaleLowerCase()}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Conditions</label>
              <select onChange={e=>setCondition(e.target.value)} value={condition} className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700">
                <option value="">All</option>
                {propertyConditions.map((condition) => (
                  <option key={condition} value={condition.toLocaleLowerCase()}>{condition}</option>
                ))}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Furnishing</label>
              <select onChange={e=>setFurnishing(e.target.value)} value={furnishing} className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700">
                <option value="">All</option>
                {PropertyFurnishing.map((furnish) => (
                  <option key={furnish} value={furnish.toLocaleLowerCase()}>{furnish}</option>
                ))}
              </select>
            </div>

            {/* Property Status */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
              <select onChange={e=>setStatus(e.target.value)} value={status} className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700">
                <option value="All">All</option>
                {propertyStatus.map((status) => (
                  <option key={status} value={status.toLocaleLowerCase()}>For {status}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value.toLocaleLowerCase())}
                placeholder="e.g., Addis Ababa, Bole"
                className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700"
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700"
                  min={0}
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Bedrooms</label>
              <select onChange={e => setBedroomCount(e.target.value)} value={bedroomCount} className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700">
                <option value="">Any</option>
                {bedrooms.map((b) => (
                  <option key={b} value={b}>{b}+</option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Bathrooms</label>
              <select onChange={e => setBathroomCount(e.target.value)} value={bathroomCount} className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700">
                <option value="">Any</option>
                {bathrooms.map((b) => (
                  <option key={b} value={b}>{b}+</option>
                ))}
              </select>
            </div>

            {/* Square Footage */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Square Footage</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min sq ft"
                  value={minSqFt}
                  onChange={(e) => setMinSqFt(e.target.value)}
                  className="w-1/2 px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700"
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Max sq ft"
                  value={maxSqFt}
                  onChange={(e) => setMaxSqFt(e.target.value)}
                  className="w-1/2 px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-primary-700 text-neutral-700"
                  min={0}
                />
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className={`px-6 cursor-pointer py-3 rounded-md ${loading ? "bg-primary-700/60" : "bg-primary-700 hover:bg-primary-800"} text-white font-semibold shadow transition-colors mt-4`}
            >
              {loading ? "Searching..." : "Search Properties"}
            </button>

            {/* Clear Filters */}
            <button
              type="button"
              className="px-6 py-2 rounded-md border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
            >
              Clear Filters
            </button>

          </form>
        </div>
      </div>
    </>
  );
} 