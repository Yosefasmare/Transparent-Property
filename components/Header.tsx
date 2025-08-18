'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { IoBookmark } from "react-icons/io5";
import Logo from '@/public/logo.webp'
import Image from "next/image";


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
    <header className="w-full bg-white/95 backdrop-blur-xl shadow-lg border-b border-neutral-200 sticky top-0 z-50 transition-all duration-300">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <span className="inline-flex items-center justify-center   rounded-xl ">
              <Image
              src={Logo}
              alt="Logo"
              width={55}
              height={55}
               />
            </span>
          </div>
          <div className="lg:flex flex-col hidden ">
            <span className="text-xs text-neutral-500 font-normal">Premium Properties</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex gap-1 items-center bg-neutral-50/50 rounded-2xl p-1.5 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative px-5 py-2.5 rounded-xl font-normal transition-all duration-300 ${
                  isActive
                    ? "text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg shadow-primary-500/25"
                    : "text-neutral-600 hover:text-primary-700 hover:bg-white/80"
                }`}
              >
                {link.name}
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-xl blur opacity-20"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Profile Link */}
        <div className="flex items-center gap-3">
          <Link 
            href="/saved-properties" 
            className="hidden md:inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 transition-all duration-300 group border border-secondary-200 hover:border-secondary-300 shadow-sm hover:shadow-md"
          >
            <div className="relative">
              <IoBookmark size={20} className="text-secondary-600 group-hover:text-secondary-700 transition-colors" />
              <div className="absolute -inset-1 bg-secondary-400 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <span className="text-neutral-600 font-normal group-hover:text-primary-700 transition-colors capitalize">saved/liked properties</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 focus:outline-none transition-all duration-300 border border-neutral-200"
             aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaXmark size={18} /> : <FaBarsStaggered size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-neutral-200 shadow-lg">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = isActiveLink(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 rounded-xl font-normal transition-all duration-300 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg"
                      : "text-neutral-600 hover:text-primary-700 hover:bg-neutral-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-neutral-200">
              <Link
                href="/saved-properties"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-secondary-50 to-secondary-100 hover:from-secondary-100 hover:to-secondary-200 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
               <IoBookmark size={20} className="text-secondary-600" />
                <span className="text-neutral-600 font-normal capitalize">saved/liked properties</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 