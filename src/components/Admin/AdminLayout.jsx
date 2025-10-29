// src/components/Admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { LogOut, BarChart2, Calendar, Users, MapPin, Scissors, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard/overview', label: 'Overview', icon: BarChart2 },
    { path: '/admin/dashboard/appointments', label: 'Appointments', icon: Calendar },
    { path: '/admin/dashboard/barbers', label: 'Barbers', icon: Users },
    { path: '/admin/dashboard/branches', label: 'Branches', icon: MapPin },
    { path: '/admin/dashboard/services', label: 'Services', icon: Scissors },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex">
      {/* Sidebar */}
      <aside 
        className={`${
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
                {/* Active Indicator */}
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

                {/* Hover Effect */}
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
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <NavLink 
            to="/"
            onClick={handleLogout}
            className="flex items-center bg-[#D4AF37] text-black font-bold py-2 px-4 rounded-lg hover:bg-black hover:text-white transition"
          >
            Logout <LogOut className="ml-2 w-5 h-5" />
          </NavLink>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;