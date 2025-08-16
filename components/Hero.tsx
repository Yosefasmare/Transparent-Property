import React from "react";
import Searchbar from "./Searchbar";
import Image from "next/image";



export default function Hero() {
  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center bg-gray-100 overflow-hidden">
      {/* Optimized LCP Image */}
      <Image
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
        alt="Find Your Dream Home"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-2/3 px-4 py-16 flex flex-col items-center text-center text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium mb-4 drop-shadow-lg">
          Find Your Dream Home
        </h1>
        <p className="mb-8 text-base sm:text-lg md:text-xl font-normal drop-shadow">
          Buy or rent the best properties in Ethiopia with ease.
        </p>
        <Searchbar />
      </div>
    </section>
  );
} 