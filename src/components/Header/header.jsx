import { useState } from 'react';
import { Menu, X, Scissors, Facebook, Instagram, Twitter, Youtube, Clock, Phone, MapPin } from 'lucide-react';
import { NavLink } from 'react-router-dom';


export default function BarberSideNav() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Branches', href: '#branches' },
    // { name: 'Services', href: '#services' },
    // { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialIcons = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Youtube size={20} />, href: '#', label: 'Youtube' }
  ];

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-black/95 backdrop-blur-md border-b border-amber-500/10">
        <div className="container mx-auto px-6 h-24 flex   items-center justify-between">
          {/* Your Original Logo */}
          <NavLink to="/" className="flex items-center">
            <img src="../../../public/logo.PNG" alt="Logo" className="h-24 w-auto" />
          </NavLink>

          {/* Desktop Horizontal Navigation - Hidden on Mobile */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="relative text-white hover:text-amber-500 font-medium transition-colors duration-300 group py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
            <button className="ml-4 py-2 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300">
              Book now
            </button>
             <button className="py-2 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300">
              Admin
            </button>
          </nav>

          {/* Mobile Menu Button - Only visible on mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-12 h-12 flex items-center justify-center text-white hover:text-amber-500 transition-colors duration-300 group"
          >
            <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 rounded-lg transition-all duration-300"></div>
            {isOpen ? <X size={28} className="relative z-10" /> : <Menu size={28} className="relative z-10" />}
          </button>
        </div>
      </header>

      {/* Mobile Side Navbar Overlay */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-sm z-40 transition-all duration-500 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Side Navbar */}
      <nav
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-gradient-to-b from-zinc-900 via-zinc-900 to-black z-50 transform transition-all duration-500 ease-out shadow-2xl lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl"></div>

          {/* Close Button */}
          <div className="relative flex justify-between items-center p-6 border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-amber-500 text-sm font-semibold tracking-wider">MENU</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Menu  */}
          <div className="relative flex-1 px-6 py-8 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item, index) => (
                <li 
                  key={index}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`${isOpen ? 'animate-fadeIn' : ''}`}
                >
                  <a
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group block relative py-4 px-6 text-lg font-semibold text-gray-300 hover:text-white rounded-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-amber-500 group-hover:h-full transition-all duration-300 rounded-r"></div>
                    <span className="relative z-10 group-hover:translate-x-2 inline-block transition-transform duration-300">
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

             
          </div>

          {/* Social Media & CTA */}
          <div className="relative px-6 py-6 border-t border-amber-500/20 bg-black/30">
            <button className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300 mb-6">
              BOOK NOW
            </button>
              <button className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/50 transform hover:scale-105 transition-all duration-300 mb-6">
               Login
            </button>
            
            <div className="space-y-4">
              <p className="text-gray-500 text-xs font-bold tracking-widest">FOLLOW US</p>
              <div className="flex gap-2">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="flex-1 h-12 rounded-lg bg-zinc-800/50 flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-black transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-amber-500/30 border border-zinc-700 hover:border-amber-500"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}