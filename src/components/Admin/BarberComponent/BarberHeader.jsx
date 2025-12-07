// components/BarberHeader.jsx

import { Scissors, X, Menu, LogOut } from 'lucide-react';

function BarberHeader({ barberData, sidebarOpen, setSidebarOpen, handleLogout }) {
  return (
    <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-lg sticky top-0 z-40 border-b border-[#D4AF37]/20">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Button - Only visible on mobile (hidden on md and above) */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
              <div>
                <h1 className="text-lg sm:text-xl font-bold">
                  {barberData?.name || 'Barber'}
                </h1>
                <p className="text-xs text-gray-300">
                  {barberData?.branch?.name || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default BarberHeader;