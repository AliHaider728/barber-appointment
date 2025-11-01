import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, DollarSign, Users, MapPin, Clock, TrendingUp, Scissors, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [apptRes, barberRes, branchRes] = await Promise.all([
        axios.get('https://barber-appointment-backend.vercel.app/api/appointments'),
        axios.get('https://barber-appointment-backend.vercel.app/api/barbers'),
        axios.get('https://barber-appointment-backend.vercel.app/api/branches')
      ]);

      const appointments = apptRes.data;
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(a => a.date.startsWith(today));

      // Calculate revenues
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

      // Enrich today's appointments
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
        barbers: barberRes.data.length,
        branches: branchRes.data.length,
        totalRevenue: totalRevenue.toFixed(2),
        pendingAppts: appointments.filter(a => a.status === 'pending').length,
        confirmedAppts: appointments.filter(a => a.status === 'confirmed').length,
        todayRevenue: todayRevenue.toFixed(2)
      });

      setTodayAppointments(enrichedToday);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">£{stats.totalRevenue}</p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">£{stats.todayRevenue}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Status Summary</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                Pending
              </span>
              <span className="font-semibold text-gray-900">{stats.pendingAppts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Confirmed
              </span>
              <span className="font-semibold text-gray-900">{stats.confirmedAppts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
        </div>
        
        <div className="p-6">
          {todayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((apt, index) => (
                <div 
                  key={apt._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-semibold text-gray-900">{apt.customerName}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Services:</strong> {apt.displayServices}</p>
                        {apt.barber && <p><strong>Barber:</strong> {apt.barber}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(apt.date).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {parseFloat(apt.displayTotal) > 0 && (
                        <div>
                          <p className="text-gray-500">Total</p>
                          <p className="font-semibold text-gray-900">£{apt.displayTotal}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable StatCard Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default Overview;