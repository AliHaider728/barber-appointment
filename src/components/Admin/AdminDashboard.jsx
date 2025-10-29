// src/components/admin/AdminDashboard.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, BarChart2, Calendar, Users, MapPin, Scissors, Menu, X } from 'lucide-react';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/overview', label: 'Overview', icon: BarChart2 },
    { path: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { path: '/admin/barbers', label: 'Barbers', icon: Users },
    { path: '/admin/branches', label: 'Branches', icon: MapPin },
    { path: '/admin/services', label: 'Services', icon: Scissors },
  ];

  const handleLogout = () => {
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between">
          <h1 className={`font-bold text-xl text-[#D4AF37] ${!sidebarOpen && 'hidden'}`}>Admin Panel</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-[#D4AF37]/10 transition ${
                  isActive ? 'bg-[#D4AF37]/20 border-r-4 border-[#D4AF37]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {menuItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center bg-[#D4AF37] text-black font-bold py-2 px-4 rounded-lg hover:bg-black hover:text-white transition"
          >
            Logout <LogOut className="ml-2 w-5 h-5" />
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">
          {/* Content will be rendered via Routes */}
          {/* We'll handle this in App.jsx */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;