import React, { useState, useEffect } from 'react';
import { LogOut, BarChart2, Calendar, Users, Scissors, Menu, X, ChevronLeft, ChevronRight, FileText, Building2, Clock } from 'lucide-react';

const API_BASE = 'https://barber-appointment-backend.vercel.app';

// Import all branch components (you'll create separate files for these)
import BranchAppointments from './BranchAppointments';
import BranchBarbers from './BranchBarbers';
import BranchServices from './BranchServices';
import BranchLeaves from './BranchLeaves';

const BranchAdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [branchInfo, setBranchInfo] = useState(null);
  const [stats, setStats] = useState({
    totalBarbers: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    activeLeaves: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const branchData = localStorage.getItem('branch-info');
    if (branchData) {
      try {
        const parsed = JSON.parse(branchData);
        setBranchInfo(parsed);
      } catch (err) {
        console.error('Failed to parse branch info:', err);
      }
    }
    
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('auth-token');
      
      if (!token) {
        throw new Error('No auth token found');
      }

      console.log('Fetching stats with token:', token); // Debug log

      const response = await fetch(`${API_BASE}/api/branch-admin/dashboard/stats${branchInfo?._id ? `?branchId=${branchInfo._id}` : ''}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Parse body regardless of status
      const data = await response.json();

      if (!response.ok) {
        console.error('Error details from backend:', data);  // This will log the full error object
        throw new Error(data.error || data.message || 'Failed to fetch stats');
      }
      
      if (data.success && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Stats fetch error:', err);
      setError('Failed to load dashboard stats. Please check your connection or login again.');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'barbers', label: 'Barbers', icon: Users },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'leaves', label: 'Leaves', icon: FileText },
  ];

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const closeMobileSidebar = () => setMobileSidebarOpen(false);

  const renderContent = () => {
    switch(currentPage) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-10 h-10" />
                <div>
                  <h2 className="text-2xl font-bold">{branchInfo?.name || 'Branch Dashboard'}</h2>
                  <p className="text-yellow-100">{branchInfo?.city || 'City'}</p>
                </div>
              </div>
              <p className="text-sm text-yellow-100">{branchInfo?.address || 'Address'}</p>
              {branchInfo?.phone && (
                <p className="text-sm text-yellow-100 mt-2">📞 {branchInfo.phone}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <p className="mt-2 text-gray-600">Loading stats...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Barbers</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.totalBarbers}</p>
                    </div>
                    <Users className="w-10 h-10 text-blue-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Today's Appointments</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</p>
                    </div>
                    <Calendar className="w-10 h-10 text-green-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Pending Appointments</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.pendingAppointments}</p>
                    </div>
                    <Clock className="w-10 h-10 text-orange-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Active Leaves</p>
                      <p className="text-3xl font-bold text-gray-900">{stats.activeLeaves}</p>
                    </div>
                    <FileText className="w-10 h-10 text-red-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-yellow-500" />
                Branch Admin Permissions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  '✓ Manage branch barbers and shifts',
                  '✓ View & manage appointments',
                  '✓ Manage services',
                  '✓ Approve/reject leaves',
                  '✓ View branch analytics'
                ].map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setCurrentPage('appointments')}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-yellow-500 hover:shadow-md transition-all"
                >
                  <Calendar className="w-8 h-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-bold text-gray-900">View Appointments</p>
                    <p className="text-xs text-gray-600">Manage bookings</p>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentPage('barbers')}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-yellow-500 hover:shadow-md transition-all"
                >
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Manage Barbers</p>
                    <p className="text-xs text-gray-600">View team</p>
                  </div>
                </button>

                <button
                  onClick={() => setCurrentPage('leaves')}
                  className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-yellow-500 hover:shadow-md transition-all"
                >
                  <FileText className="w-8 h-8 text-red-500" />
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Review Leaves</p>
                    <p className="text-xs text-gray-600">Approve requests</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'appointments':
        return <BranchAppointments />;

      case 'barbers':
        return <BranchBarbers />;

      case 'services':
        return <BranchServices />;

      case 'leaves':
        return <BranchLeaves />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex flex-col">
      <div className="flex flex-1">
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={closeMobileSidebar}
          ></div>
        )}

        <aside className={`hidden lg:block ${sidebarOpen ? 'w-72' : 'w-20'} bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transition-all duration-300 relative border-r border-yellow-500/20`}>
          <div className="absolute top-0 left-0 w-full h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative p-6 border-b border-yellow-500/20">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-yellow-500" />
                  <h1 className="font-black text-[19px] text-white uppercase tracking-tight">Branch Admin</h1>
                </div>
              )}
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all"
              >
                {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <nav className="relative mt-6 px-3 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => setCurrentPage(item.id)} 
                  className={`w-full group relative flex items-center px-4 py-4 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-lg' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-r-full"></div>
                  )}
                  <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-black' : ''}`} />
                  {sidebarOpen && (
                    <span className={`ml-4 font-bold uppercase tracking-wide text-sm ${isActive ? 'text-black' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <aside className={`fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-black via-gray-900 to-black shadow-2xl transition-transform duration-300 lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="relative p-6 border-b border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-8 h-8 text-yellow-500" />
                <h1 className="font-black text-xl text-white">Branch Admin</h1>
              </div>
              <button 
                onClick={closeMobileSidebar} 
                className="p-2 rounded-xl bg-yellow-500/10 text-yellow-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <nav className="relative mt-6 px-3 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => { 
                    setCurrentPage(item.id); 
                    closeMobileSidebar(); 
                  }} 
                  className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="ml-4 font-bold text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm px-4 sm:px-6 py-4 flex justify-between items-center">
            <button 
              onClick={() => setMobileSidebarOpen(true)} 
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              {menuItems.find(i => i.id === currentPage)?.label}
            </h2>
            <button 
              onClick={handleLogout} 
              className="flex items-center bg-red-600 text-white font-bold py-2 px-3 sm:px-4 rounded-lg hover:bg-white hover:text-red-600 transition-all ease-in-out  border-[2px] border-transparent  hover:border-[2px] hover:border-red-600 "
            >
             <LogOut className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </header>

          <main className="p-4 sm:p-6 flex-1 bg-gray-50 overflow-auto">
            {renderContent()}
          </main>

          <footer className="bg-gradient-to-r from-black via-gray-900 to-black text-white py-6 px-4 sm:px-6 border-t border-yellow-500/20">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} <span className="text-yellow-500 font-semibold">Barber Shop</span>. All Rights Reserved.
              </p>
              <p className="text-sm text-gray-400">
                Designed by <span className="text-yellow-500 font-semibold">TecnoSphere</span>
              </p>  
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default BranchAdminLayout;