import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, MapPin, Clock, TrendingUp, Scissors, CheckCircle, AlertCircle, Search, Filter, Download, X } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState({
    totalAppts: 0,
    todayAppts: 0,
    barbers: 0,
    branches: 0,
    totalRevenue: 0,
    pendingAppts: 0,
    confirmedAppts: 0,
    todayRevenue: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, todayAppointments]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [apptRes, barberRes, branchRes] = await Promise.all([
        fetch('https://barber-appointment-backend.vercel.app/api/appointments'),
        fetch('https://barber-appointment-backend.vercel.app/api/barbers'),
        fetch('https://barber-appointment-backend.vercel.app/api/branches')
      ]);

      const appointments = await apptRes.json();
      const barbers = await barberRes.json();
      const branches = await branchRes.json();
      
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(a => a.date.startsWith(today));

      const calculateRevenue = (appts) => {
        return appts.reduce((sum, apt) => {
          if (apt.totalPrice) return sum + apt.totalPrice;
          if (Array.isArray(apt.services)) {
            return sum + apt.services.reduce((s, srv) => {
              const price = srv.price || srv.serviceRef?.price || '£0';
              return s + (parseFloat(price.replace('£', '')) || 0);
            }, 0);
          }
          return sum;
        }, 0);
      };

      const totalRevenue = calculateRevenue(appointments);
      const todayRevenue = calculateRevenue(todayAppts);

      const enrichedToday = todayAppts.map(apt => {
        let services = [];
        let totalPrice = 0;

        if (Array.isArray(apt.services)) {
          services = apt.services.map(s => s.name || s.serviceRef?.name || 'Unknown');
          totalPrice = apt.services.reduce((sum, s) => {
            const price = s.price || s.serviceRef?.price || '£0';
            return sum + (parseFloat(price.replace('£', '')) || 0);
          }, 0);
        } else if (apt.service) {
          services = [apt.service];
        }

        return {
          ...apt,
          displayServices: services.filter(Boolean).join(', ') || 'N/A',
          displayTotal: totalPrice.toFixed(2)
        };
      });

      setStats({
        totalAppts: appointments.length,
        todayAppts: todayAppts.length,
        barbers: barbers.length,
        branches: branches.length,
        totalRevenue: totalRevenue.toFixed(2),
        pendingAppts: appointments.filter(a => a.status === 'pending').length,
        confirmedAppts: appointments.filter(a => a.status === 'confirmed').length,
        todayRevenue: todayRevenue.toFixed(2)
      });

      setTodayAppointments(enrichedToday);
      setFilteredAppointments(enrichedToday);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...todayAppointments];

    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.displayServices.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.barber && apt.barber.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Customer Name', 'Status', 'Services', 'Barber', 'Time', 'Total'];
    const rows = filteredAppointments.map(apt => [
      apt.customerName,
      apt.status,
      apt.displayServices,
      apt.barber || 'N/A',
      new Date(apt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      `£${apt.displayTotal}`
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-20 px-4">
        <div className="text-center">
          <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-gray-200 border-t-[#d4af37] rounded-full animate-spin"></div>
          <p className="mt-4 text-sm sm:text-base text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center mx-4">
        <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 mx-auto mb-3" />
        <p className="text-sm sm:text-base text-red-800 font-medium">{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 px-4 sm:px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard 
          icon={Calendar} 
          label="Total Appointments" 
          value={stats.totalAppts} 
          color="blue"
        />
        <StatCard 
          icon={Clock} 
          label="Today's Appointments" 
          value={stats.todayAppts} 
          color="green"
        />
        <StatCard 
          icon={Users} 
          label="Total Barbers" 
          value={stats.barbers} 
          color="purple"
        />
        <StatCard 
          icon={MapPin} 
          label="Total Branches" 
          value={stats.branches} 
          color="orange"
        />
      </div>

      {/* Revenue & Status - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">£{stats.totalRevenue}</p>
            </div>
            <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Today's Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">£{stats.todayRevenue}</p>
            </div>
            <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200 sm:col-span-2 lg:col-span-1">
          <p className="text-xs sm:text-sm text-gray-600 mb-3">Appointment Status</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                Pending
              </span>
              <span className="font-bold text-base sm:text-lg">{stats.pendingAppts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Confirmed
              </span>
              <span className="font-bold text-base sm:text-lg">{stats.confirmedAppts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments with Filters - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Today's Appointments
                <span className="ml-2 text-sm sm:text-base text-gray-500">({filteredAppointments.length})</span>
              </h3>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {/* Desktop Export Button */}
              <button
                onClick={exportToCSV}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-white rounded-lg hover:bg-[#c9a332] transition text-sm font-medium"
                disabled={filteredAppointments.length === 0}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            {/* Desktop Filters */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers, services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Mobile Filters - Collapsible */}
            {showFilters && (
              <div className="sm:hidden space-y-3 pt-2 border-t border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={exportToCSV}
                  className="w-full flex items-center justify-center hover:translate-y-2 duration-300   gap-2 px-4 py-2 bg-[#d4af37] text-white rounded-lg hover:bg-[#c9a332] transition text-sm font-medium"
                  disabled={filteredAppointments.length === 0}
                  
                >
                  <Download className="w-4 h-4" />
                  Export to CSV
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3 sm:p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm sm:text-base text-gray-600">
                {todayAppointments.length === 0 
                  ? 'No appointments scheduled for today'
                  : 'No appointments match your filters'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Services</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Barber</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                              {apt.customerName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900">{apt.customerName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">{apt.displayServices}</td>
                        <td className="px-4 py-4 text-sm text-gray-700">{apt.barber || 'N/A'}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          {new Date(apt.date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </td>
                        <td className="px-4 py-4 text-sm font-bold text-gray-900">
                          {parseFloat(apt.displayTotal) > 0 ? `£${apt.displayTotal}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filteredAppointments.map((apt) => (
                  <div key={apt._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                          {apt.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{apt.customerName}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(apt.date).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Services:</span>
                        <span className="font-medium text-gray-900 text-right">{apt.displayServices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Barber:</span>
                        <span className="font-medium text-gray-900">{apt.barber || 'N/A'}</span>
                      </div>
                      {parseFloat(apt.displayTotal) > 0 && (
                        <div className="flex justify-between pt-2 border-t border-gray-300">
                          <span className="text-gray-600 font-medium">Total:</span>
                          <span className="font-bold text-gray-900">£{apt.displayTotal}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-200 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{label}</p>
          <p className="text-xl sm:text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${colorClasses[color]} flex-shrink-0 ml-2`}>
          <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
        </div>
      </div>
    </div>
  );
};

export default Overview;