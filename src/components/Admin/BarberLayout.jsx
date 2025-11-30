// src/components/Barber/BarberLayout.jsx
import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; // Outlet renders child routes
import { createClient } from '@supabase/supabase-js'; // For auth if needed
import { LogOut, Calendar, DollarSign, Clock, Users } from 'lucide-react'; // Icons (install lucide-react if not already)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BarberLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || session.user.user_metadata.role !== 'barber') {
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-[#D4AF37]">Barber Dashboard</h2>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/barber/dashboard" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
              >
                <Users className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/barber/bookings" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
              >
                <Calendar className="w-5 h-5 mr-3" />
                Bookings
              </Link>
            </li>
            <li>
              <Link 
                to="/barber/shifts" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
              >
                <Clock className="w-5 h-5 mr-3" />
                Shifts/Schedule
              </Link>
            </li>
            <li>
              <Link 
                to="/barber/payments" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
              >
                <DollarSign className="w-5 h-5 mr-3" />
                Payments
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-semibold">Barber Panel</h1>
        </header>
        
        {/* Child Routes Render Here */}
        <main className="p-6">
          <Outlet /> {/* This renders the nested routes like BarberDashboard */}
        </main>
      </div>
    </div>
  );
};

export default BarberLayout;