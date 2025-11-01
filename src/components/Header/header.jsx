import { useState, useEffect } from 'react';
import { Menu, X, Scissors, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsLoggedIn(!!token);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Branches', href: '/branches' },
    { name: 'About', href: '/About' },

    
  ];
  

 

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    window.location.href = '/admin';
  };

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-lg shadow-lg shadow-[#D4AF37]/10' 
          : 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center group">
            <div className="relative">
              <img 
                src="./logo.png" 
                alt="Logo" 
                className="h-20 w-auto transition-transform duration-300 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/5 rounded-lg transition-all duration-300"></div>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.href}
                className={({ isActive }) =>
                  `relative px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 group ${
                    isActive 
                      ? 'text-[#D4AF37]' 
                      : 'text-white hover:text-[#D4AF37]'
                  }`
                }
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            ))}
            
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
              <NavLink to="/booking">
                <button className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold rounded-full uppercase tracking-wider text-sm hover:from-black hover:to-gray-900 hover:text-white transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/50 transform hover:scale-105">
                  Book Now
                </button>
              </NavLink>
              
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-white/10 text-white font-bold rounded-full uppercase tracking-wider text-sm hover:bg-red-600 hover:text-white transition-all duration-300 border border-white/20 hover:border-red-600"
                >
                  Logout
                </button>
              ) : (
                <NavLink to="/admin">
                  <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-full uppercase tracking-wider text-sm hover:bg-[#D4AF37] hover:text-black transition-all duration-300 border border-white/20 hover:border-[#D4AF37]">
                    Admin
                  </button>
                </NavLink>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-12 h-12 flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors duration-300 group"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 rounded-xl transition-all duration-300"></div>
            {isOpen ? <X size={28} className="relative z-10" /> : <Menu size={28} className="relative z-10" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-md z-40 transition-all duration-500 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Side Navigation */}
      <nav
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-gradient-to-b from-black via-gray-900 to-black z-50 transform transition-all duration-500 ease-out shadow-2xl lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F4D03F]/10 rounded-full blur-3xl"></div>

          {/* Header */}
          <div className="relative flex justify-between items-center p-6 border-b border-[#D4AF37]/20">
            <div className="flex items-center gap-3">
              <Scissors className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-black tracking-widest uppercase">Menu</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="relative flex-1 px-6 py-8 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`${isOpen ? 'animate-fadeIn' : ''}`}
                >
                  <NavLink
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                   
                                        className="group block relative py-3.5 px-6 text-base font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"

                  >
                     <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-[#D4AF37] group-hover:w-8 transition-all duration-300"></div>
                    <span className="relative z-10 pl-10 group-hover:translate-x-1 transition-transform duration-300">
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Section - CTAs & Social */}
          <div className="relative px-6 py-8 border-t border-[#D4AF37]/20 bg-black/50 backdrop-blur-sm space-y-4">
            {/* Book Now Button */}
            <NavLink to="/booking" onClick={() => setIsOpen(false)}>
              <button className="w-full py-4  mb-3 px-6 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-black rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/50 transform hover:scale-105 transition-all duration-300 uppercase tracking-wider flex items-center justify-center gap-2">
                <Scissors className="w-5 h-5" />
                Book Now
              </button>
            </NavLink>

            {/* Admin/Logout Button */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full py-4 px-6 bg-red-600/20 text-red-500 font-black rounded-2xl hover:bg-red-600 hover:text-white border-2 border-red-600/30 hover:border-red-600 transition-all duration-300 uppercase tracking-wider"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/admin" onClick={() => setIsOpen(false)}>
                <button className="w-full py-4 px-6 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 border-2 border-white/10 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 uppercase tracking-wider">
                  Admin Login
                </button>
              </NavLink>
            )}

            
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