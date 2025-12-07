// components/BarberSidebar.jsx

import { Home, Calendar, Clock, CreditCard, Briefcase, User } from 'lucide-react';

function BarberSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'schedule', label: 'My Schedule', icon: Clock },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'leaves', label: 'Leaves', icon: Briefcase },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile Sidebar - slides in from left, hidden on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden border-r border-[#D4AF37]/20 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        
        <nav className="relative p-3 space-y-2 mt-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`group relative w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ${
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
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Desktop Sidebar - always visible, not affected by mobile toggle */}
      <aside className="hidden md:block w-64 bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl min-h-screen border-r border-[#D4AF37]/20">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-64 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
        
        <nav className="relative p-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 ${
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
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default BarberSidebar;