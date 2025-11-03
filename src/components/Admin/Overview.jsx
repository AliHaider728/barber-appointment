import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Users, MapPin, Clock, TrendingUp, Scissors, CheckCircle, AlertCircle, Search, Filter, Download } from 'lucide-react';

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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
        <p className="text-red-800 font-medium">{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Revenue & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">£{stats.totalRevenue}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900">£{stats.todayRevenue}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Appointment Status</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                Pending
              </span>
              <span className="font-bold text-lg">{stats.pendingAppts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Confirmed
              </span>
              <span className="font-bold text-lg">{stats.confirmedAppts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments with Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Appointments ({filteredAppointments.length})</h3>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers, services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
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

              {/* Export Button */}
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-white rounded-lg hover:bg-[#d4af37] transition text-sm font-medium"
                disabled={filteredAppointments.length === 0}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">
                {todayAppointments.length === 0 
                  ? 'No appointments scheduled for today'
                  : 'No appointments match your filters'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </div>
  );
};

export default Overview;