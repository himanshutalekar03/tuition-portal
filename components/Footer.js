"use client";

import React from 'react';
import Link from "next/link";
import { GraduationCap, MapPin, Phone, Twitter, Youtube, Facebook } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', icon: <Twitter size={20} />, href: '#' },
    { name: 'YouTube', icon: <Youtube size={20} />, href: '#' },
    { name: 'Facebook', icon: <Facebook size={20} />, href: '#' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-indigo-500" />
              <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
                EduTech
              </span>
            </Link>
            <p className="text-sm">
              Empowering students with quality education and personalized guidance for a brighter future.
            </p>
          </div>

          {/* Column 2: Branch Addresses */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Our Branches</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-slate-200 mb-1">Branch - I (Jaripatka)</h4>
                <p>Nagpur, Maharashtra - 440014</p>
                <a href="tel:9579700854" className="flex items-center gap-2 mt-1 hover:text-indigo-400 transition-colors">
                  <Phone size={14} />
                  <span>xxxxxxxx</span>
                </a>
              </div>
              <div>
                <h4 className="font-medium text-slate-200 mb-1">Branch - II (Subhash Nagar)</h4>
                <p>Nagpur, Maharashtra - 440022</p>
                <a href="tel:9356578901" className="flex items-center gap-2 mt-1 hover:text-indigo-400 transition-colors">
                  <Phone size={14} />
                  <span>xxxxxxxx</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  aria-label={link.name}
                  className="w-10 h-10 bg-slate-800 hover:bg-indigo-600 rounded-full flex items-center justify-center transition-colors"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} EduTech. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
