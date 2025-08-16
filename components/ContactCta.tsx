import React from "react";

export default function ContactCta() {
  return (
    <section className="py-10 bg-indigo-50 border-t border-b border-indigo-100">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 mb-4">
          Want to Rent or Sell Your House?
        </h2>
        <p className="text-gray-600 mb-6">
          Contact us today and let us help you reach thousands of potential buyers and renters!
        </p>
        <a
          href="#contact"
          className="inline-block px-8 py-3 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition-colors text-base sm:text-lg"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
} 