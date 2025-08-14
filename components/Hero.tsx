import React from "react";
import Searchbar from "./Searchbar";



export default function Hero() {
  return (
    <section
      className="relative w-full min-h-[60vh] flex items-center justify-center bg-gray-100 overflow-hidden"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80)',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute  inset-0 bg-black/40" />
      <div className="relative z-10 w-2/3   px-4 py-16 flex flex-col items-center text-center text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">Find Your Dream Home</h1>
        <p className="mb-8 text-lg md:text-xl font-medium drop-shadow">Buy or rent the best properties in Ethiopia with ease.</p>
         <Searchbar />
      </div>
    </section>
  );
} 