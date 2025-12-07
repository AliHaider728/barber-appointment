import React, { useState } from 'react';
import { LogOut, Calendar, DollarSign, Clock, Users, Menu, X, BarChart3 } from 'lucide-react';

const BarberLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/barber/dashboard');

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out successfully!');
  };

  const navItems = [
    { path: '/barber/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/barber/bookings', label: 'Bookings', icon: Calendar },
    { path: '/barber/shifts', label: 'Shifts/Schedule', icon: Clock },
    { path: '/barber/payments', label: 'Payments', icon: DollarSign },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8941F] bg-clip-text text-transparent">
              Barber Panel
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage your schedule</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setActiveRoute(item.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                activeRoute === item.path
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-white shadow-lg shadow-[#D4AF37]/30'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  activeRoute === item.path ? 'text-white' : 'text-gray-400 group-hover:text-[#D4AF37]'
                }`}
              />
              <span className="font-medium">{item.label}</span>
              {activeRoute === item.path && (
                <div className="ml-auto w-2 h-2 rounded-full bg-white" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-gray-800">
                {navItems.find(item => item.path === activeRoute)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">John Doe</p>
              <p className="text-xs text-gray-500">Professional Barber</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center text-white font-semibold">
              JD
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {/* Demo Content */}
          <div className="max-w-7xl mx-auto">
            {activeRoute === '/barber/dashboard' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Bookings', value: '156', change: '+12%', color: 'blue' },
                    { label: 'Today\'s Appointments', value: '8', change: '+3', color: 'green' },
                    { label: 'Total Revenue', value: '$4,320', change: '+18%', color: 'yellow' },
                    { label: 'Avg Rating', value: '4.8', change: '+0.2', color: 'purple' },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-700`}>
                          {stat.change}
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {['New booking from Mike Johnson', 'Payment received: $45', 'Appointment completed with Sarah Williams'].map((activity, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        <p className="text-sm text-gray-700">{activity}</p>
                        <span className="ml-auto text-xs text-gray-500">2h ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeRoute !== '/barber/dashboard' && (
              <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {navItems.find(item => item.path === activeRoute)?.label}
                </h2>
                <p className="text-gray-600">Content for this section will appear here</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BarberLayout;