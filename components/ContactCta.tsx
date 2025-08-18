import Link from "next/link";
import React from "react";

export default function ContactCta() {
  return (
    <section className="py-10 bg-primary-50 border-t border-b border-primary-100">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-neutral-800 mb-4">
          Want to Rent or Sell Your House?
        </h2>
        <p className="text-neutral-600 mb-6">
          Contact us today and let us help you reach thousands of potential buyers and renters!
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 rounded-md bg-primary-700 text-white font-medium shadow hover:bg-primary-800 transition-colors text-base sm:text-lg"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
} 