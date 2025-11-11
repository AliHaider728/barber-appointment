// src/components/Admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, BarChart2, Calendar, Users, MapPin, Scissors, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard/overview', label: 'Overview', icon: BarChart2 },
    { path: '/admin/dashboard/appointments', label: 'Appointments', icon: Calendar },
    { path: '/admin/dashboard/barbers', label: 'Barbers & Shifts', icon: Users },
    { path: '/admin/dashboard/branches', label: 'Branches', icon: MapPin },
    { path: '/admin/dashboard/services', label: 'Services', icon: Scissors },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
          
          .shiny-text {
            position: relative;
            display: inline-block;
            font-family: "Josefin Sans", sans-serif;
            overflow: hidden;
          }
          
          .shiny-text::after {
            content: "";
            position: absolute;
            top: 0;
            left: -150%;
            width: 150%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(212,175,55,0) 0%,
              rgba(212,175,55,0.6) 50%,
              rgba(212,175,55,0) 100%
            );
            animation: shine 3s linear infinite;
          }
          
          @keyframes shine {
            0%   { left: -150%; }
            100% { left: 150%; }
          }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex flex-col">
        <div className="flex flex-1">
          {/* Mobile Sidebar Backdrop */}
          {mobileSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMobileSidebar}
            ></div>
          )}

          {/* Desktop Sidebar */}
          <aside 
            className={`hidden lg:block ${
              sidebarOpen ? 'w-72' : 'w-20'
            } bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transition-all duration-300 relative border-r border-[#D4AF37]/20`}
          >
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-64 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
            
            {/* Header */}
            <div className="relative p-6 border-b border-[#D4AF37]/20">
              <div className="flex items-center justify-between">
                {sidebarOpen && (
                  <div className="flex items-center gap-3">
                    <Scissors className="w-8 h-8 text-[#D4AF37]" />
                    <h1 className="font-black text-xl text-white uppercase tracking-tight">Admin Panel</h1>
                  </div>
                )}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                >
                  {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="relative mt-6 px-3 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black shadow-lg shadow-[#D4AF37]/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-r-full"></div>
                    )}
                    
                    <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-black' : ''}`} />
                    
                    {sidebarOpen && (
                      <span className={`ml-4 font-bold uppercase tracking-wide text-sm ${
                        isActive ? 'text-black' : ''
                      }`}>
                        {item.label}
                      </span>
                    )}

                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:to-[#D4AF37]/5 rounded-2xl transition-all duration-300"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Mobile Sidebar */}
          <aside 
            className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transition-transform duration-300 lg:hidden ${
              mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-64 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
            
            {/* Header */}
            <div className="relative p-6 border-b border-[#D4AF37]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Scissors className="w-8 h-8 text-[#D4AF37]" />
                  <h1 className="font-black text-xl text-white uppercase tracking-tight">Admin Panel</h1>
                </div>
                <button
                  onClick={closeMobileSidebar}
                  className="p-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <nav className="relative mt-6 px-3 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileSidebar}
                    className={`group relative flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black shadow-lg shadow-[#D4AF37]/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-r-full"></div>
                    )}
                    
                    <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-black' : ''}`} />
                    
                    <span className={`ml-4 font-bold uppercase tracking-wide text-sm ${
                      isActive ? 'text-black' : ''
                    }`}>
                      {item.label}
                    </span>

                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/0 to-[#D4AF37]/0 group-hover:from-[#D4AF37]/10 group-hover:to-[#D4AF37]/5 rounded-2xl transition-all duration-300"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Admin Header */}
            <header className="bg-white shadow-sm px-4 sm:px-6 py-4 flex justify-between items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              
              <button 
                onClick={handleLogout}
                className="flex items-center bg-[#D4AF37] text-black font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-black hover:text-white transition text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Logout</span>
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 sm:ml-2" />
              </button>
            </header>

            {/* Page Content */}
            <main className="p-4 sm:p-6 flex-1 bg-gray-50 overflow-auto">
              <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-6 px-4 sm:px-6 border-t border-[#D4AF37]/20">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Copyright */}
                  <div className="text-center sm:text-left">
                    <p className="text-sm text-gray-400">
                      © {new Date().getFullYear()} <span className="shiny-text text-[#D4AF37] font-semibold">Barber Shop</span>. All Rights Reserved.
                    </p>
                  </div>

                  {/* Divider for mobile */}
                  <div className="hidden sm:block w-px h-8 bg-[#D4AF37]/20"></div>

                  {/* Designed By */}
                  <div className="text-center sm:text-right">
                    <p className="text-sm text-gray-400">
                      Designed & Developed by <span className="shiny-text text-[#D4AF37] font-semibold">TecnoSphere</span>
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;