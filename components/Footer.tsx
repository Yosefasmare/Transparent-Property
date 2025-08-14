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
    icon: <FaFacebookF className="text-blue-600" size={20} />,
    href: "#",
  },
  {
    name: "Twitter",
    icon: <FaTwitter className="text-blue-400" size={20} />,
    href: "#",
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="text-pink-500" size={20} />,
    href: "#",
  },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-white via-blue-50 to-pink-50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* Logo & Newsletter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M9 21V7a3 3 0 0 1 6 0v14"/></svg>
            </span>
            <span className="font-bold text-xl text-gray-800 tracking-tight">Hulu House</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">we are ....</p>
        </div>
        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 tracking-wide">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <a href={link.href} className="text-gray-600 hover:text-indigo-600 transition-colors text-base font-medium">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 tracking-wide">Contact</h4>
          <ul className="space-y-2 text-base text-gray-600">
            <li><span className="font-medium text-gray-700">Email:</span> info@huluhouse.com</li>
            <li><span className="font-medium text-gray-700">Phone:</span> +251 912 345 678</li>
            <li><span className="font-medium text-gray-700">Address:</span> Bole, Addis Ababa, Ethiopia</li>
          </ul>
        </div>
        {/* Social Media */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 tracking-wide">Follow Us</h4>
          <div className="flex gap-5 mt-1">
            {socialLinks.map((s) => (
              <a key={s.name} href={s.href} className="hover:scale-110 hover:bg-white/70 rounded-full p-2 transition-all shadow-sm" aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 text-xs py-5 border-t bg-white/60">© {new Date().getFullYear()} Hulu House. All rights reserved.</div>
    </footer>
  );
} 