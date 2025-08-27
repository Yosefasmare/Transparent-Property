import Link from "next/link";
import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa6";

const quickLinks = [
  { name: "Properties", href: "/properties" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    name: "Facebook",
    icon: <FaFacebookF className="text-white" size={20} />,
    href: "#",
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="text-white" size={20} />,
    href: "https://www.instagram.com/househulu/",
  },
];

export default function Footer() {
  return (
    <footer className="bg-primary-900 border-t border-primary-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* Logo & Newsletter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-primary-700 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M9 21V7a3 3 0 0 1 6 0v14"/></svg>
            </span>
            <span className="font-medium text-xl text-white tracking-tight">Hullu House</span>
          </div>
          <p className="text-neutral-300 text-sm mb-4">Find your dream home with Hullu House — a trusted platform for renting and selling houses. Browse verified properties and connect with reliable agents.</p>
        </div>
        {/* Quick Links */}
        <div>
          <h2 className="font-medium text-white mb-4 tracking-wide">Quick Links</h2>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="text-neutral-200 hover:text-secondary-400 transition-colors text-base font-normal">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h4 className="font-medium text-white mb-4 tracking-wide">Contact</h4>
          <ul className="space-y-2 text-base text-neutral-200">
            <li><span className="font-normal text-neutral-300">Email:</span> info@hulluhouse.com</li>
            <li><span className="font-normal text-neutral-300">Phone:</span> +251 912 345 678</li>
            <li><span className="font-normal text-neutral-300">Address:</span> Bole, Addis Ababa, Ethiopia</li>
          </ul>
        </div>
        {/* Social Media */}
        <div>
          <h2 className="font-medium text-white mb-4 tracking-wide">Follow Us</h2>
          <div className="flex gap-5 mt-1">
            {socialLinks.map((s) => (
              <Link key={s.name} href={s.href} className="hover:scale-110 hover:bg-primary-800 rounded-full p-2 transition-all shadow-sm" aria-label={s.name}>
                {s.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center text-neutral-300 text-xs py-5 border-t border-primary-800 bg-primary-900">© {new Date().getFullYear()} Hullu House. All rights reserved.</div>
    </footer>
  );
} 