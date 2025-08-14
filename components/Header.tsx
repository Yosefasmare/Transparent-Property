'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaBarsStaggered, FaRegCircleUser, FaXmark } from "react-icons/fa6";

const navLinks = [
  { name: "Properties", href: "/properties" },
  { name: "Locations", href: "/locations" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActiveLink = (href: string) => {
    if (href === "/properties") {
      return pathname === "/properties";
    }
    return pathname === href;
  };

  return (
    <header className="w-full  bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <path d="M9 21V7a3 3 0 0 1 6 0v14"/>
              </svg>
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Hulu House
            </span>
            <span className="text-xs text-gray-500 font-medium">Premium Properties</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex gap-1 items-center bg-gray-50/50 rounded-2xl p-1.5 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-white/80"
                }`}
              >
                {link.name}
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl blur opacity-20"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Profile Link */}
        <div className="flex items-center gap-3">
          <Link 
            href="/profile" 
            className="hidden md:inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300 group border border-indigo-100 hover:border-indigo-200 shadow-sm hover:shadow-md"
          >
            <div className="relative">
              <FaRegCircleUser size={20} className="text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              <div className="absolute -inset-1 bg-indigo-400 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className="text-gray-700 font-semibold group-hover:text-indigo-700 transition-colors">Profile</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 focus:outline-none transition-all duration-300 border border-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaXmark size={18} /> : <FaBarsStaggered size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
                      : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-100">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaRegCircleUser size={20} className="text-indigo-600" />
                <span className="text-gray-700 font-semibold">Profile</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 