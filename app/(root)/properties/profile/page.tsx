import Image from "next/image";
import React from "react";
import { FaHeart, FaRegMoon, FaRegSun } from "react-icons/fa6";

const dummyLikedProperties = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
    price: "Br 5,200,000",
    title: "Modern Family House",
    location: "Addis Ababa, Bole",
    type: "House",
    status: "For Sale",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80",
    price: "Br 3,800,000",
    title: "Luxury Apartment",
    location: "Addis Ababa, Sar Bet",
    type: "Apartment",
    status: "For Rent",
  },
];

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-pink-50 pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <span className="text-5xl text-indigo-500 font-bold">U</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">User Name</h2>
          <p className="text-gray-500">user@email.com</p>
        </div>

        {/* System Preferences */}
        <section className="mb-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">System Preferences</h3>
          <div className="flex items-center gap-4 bg-white rounded-xl shadow p-4">
            <span className="text-gray-600">Theme:</span>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 transition-colors">
              <FaRegSun className="text-yellow-400" />
              <span>Light</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-indigo-50 transition-colors">
              <FaRegMoon className="text-indigo-400" />
              <span>Dark</span>
            </button>
          </div>
        </section>

        {/* Liked/Saved Properties */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Liked Properties</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {dummyLikedProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={200}
                    height={300}
                    className="object-cover w-full h-full"
                  />
                  <button className="absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow">
                    <FaHeart className="text-rose-500" />
                  </button>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <h4 className="text-md font-bold text-gray-800 mb-1 truncate">{property.title}</h4>
                  <p className="text-sm text-gray-500 mb-2">{property.location}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-indigo-600 font-semibold">{property.price}</span>
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full font-medium">
                      {property.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}