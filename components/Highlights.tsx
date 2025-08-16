import React from "react";

const highlights = [
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><circle cx="16" cy="16" r="14" /><path d="M8 16l4 4 8-8" /></svg>
    ),
    title: "Trusted Agents",
    desc: "Work with verified, experienced real estate agents.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><rect x="4" y="4" width="24" height="24" rx="6" /><path d="M16 2v4M16 30v-4M2 16h4m24 0h-4" /></svg>
    ),
    title: "Easy Search",
    desc: "Find your ideal property with powerful filters.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><rect x="4" y="8" width="24" height="16" rx="4" /><path d="M4 12h24" /></svg>
    ),
    title: "Secure Payment",
    desc: "Safe and transparent payment process.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><circle cx="16" cy="16" r="14" /><path d="M16 8v8l6 3" /></svg>
    ),
    title: "24/7 Support",
    desc: "Get help anytime from our dedicated team.",
  },
];

export default function Highlights() {
  return (
    <section className="py-12 bg-gray-50" id="highlights">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-800 mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 