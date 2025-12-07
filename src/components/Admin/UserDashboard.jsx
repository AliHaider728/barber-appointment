import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Calendar, MapPin, Clock, Phone, Mail, User, Check, X, Settings, Bell, CreditCard, Star, TrendingUp, Activity, AlertCircle } from 'lucide-react';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth-token');

      if (!token) {
        navigate('/login');
        return;
      }

      const userRes = await axios.get(
        'https://barber-appointment-backend.vercel.app/api/auth/me',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = userRes.data.user;
      if (user.role !== 'user') {
        navigate('/login');
        return;
      }

      setUserData(user);

      const appoRes = await axios.get(
        'https://barber-appointment-backend.vercel.app/api/appointments',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const userAppointments = (appoRes.data || []).filter(
        apt => apt.email === user.email || apt.userId === user._id
      );

      userAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAppointments(userAppointments);
    } catch (error) {
      console.error('Load error:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      setCancellingId(appointmentId);
      const token = localStorage.getItem('auth-token');
      
      await axios.patch(
        `https://barber-appointment-backend.vercel.app/api/appointments/${appointmentId}`,
        { status: 'cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setAppointments(prev => prev.map(apt => 
        apt._id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      ));

      alert('Appointment cancelled successfully');
    } catch (error) {
      console.error('Cancel error:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Calculate stats
  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const upcomingAppointments = appointments.filter(
    a => (a.status === 'confirmed' || a.status === 'pending') && new Date(a.date) >= new Date()
  ).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-800 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <p className="text-red-400 font-semibold">Failed to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="backdrop-blur-xl bg-black/40 border-b border-gray-800/50 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <User className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Welcome back, {userData.fullName?.split(' ')[0]}</h1>
                <p className="text-sm text-gray-400">{userData.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white transition-all duration-300 border border-gray-700/50">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">Notifications</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 border border-red-500/20 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black shadow-lg shadow-[#D4AF37]/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-400' },
                { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'from-[#D4AF37]/20 to-[#F4D03F]/20', border: 'border-[#D4AF37]/30', text: 'text-[#D4AF37]' },
                { label: 'Completed', value: stats.completed, icon: Check, color: 'from-green-500/20 to-green-600/20', border: 'border-green-500/30', text: 'text-green-400' },
                { label: 'Cancelled', value: stats.cancelled, icon: X, color: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30', text: 'text-red-400' }
              ].map((stat, i) => (
                <div key={i} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} backdrop-blur-xl border ${stat.border} p-6 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl group`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-2">{stat.label}</p>
                      <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} border ${stat.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-6 h-6 ${stat.text}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    <span>Last 30 days</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-gray-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#F4D03F]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Upcoming Appointments</h3>
                </div>
                <button 
                  onClick={() => setActiveTab('appointments')}
                  className="text-sm text-[#D4AF37] hover:text-[#F4D03F] font-medium transition-colors"
                >
                  View All →
                </button>
              </div>

              {upcomingAppointments.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">No upcoming appointments</p>
                  <p className="text-sm text-gray-500 mt-2">Book your next appointment today</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {upcomingAppointments.map(apt => (
                    <div key={apt._id} className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-5 hover:border-[#D4AF37]/30 transition-all duration-300 group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-black" />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{new Date(apt.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                              <p className="text-sm text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {apt.time}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <User className="w-4 h-4" />
                            <span>Barber: <span className="text-white font-medium">{apt.barber?.name || 'Not Assigned'}</span></span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {apt.services?.map((s, i) => (
                              <span key={i} className="px-3 py-1 rounded-lg bg-gray-800/50 border border-gray-700/50 text-xs text-gray-300">
                                {s.name}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#D4AF37]">£{apt.totalPrice?.toFixed(2)}</p>
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold mt-2 ${
                            apt.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {apt.status?.charAt(0).toUpperCase() + apt.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#F4D03F]/10 backdrop-blur-xl rounded-2xl border border-[#D4AF37]/30 p-6 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                    <Calendar className="w-7 h-7 text-black" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Book New Appointment</h4>
                    <p className="text-sm text-gray-400">Schedule your next visit</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Star className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Rate Your Experience</h4>
                    <p className="text-sm text-gray-400">Share your feedback</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
            <div className="px-6 py-8 border-b border-gray-700/50">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] flex items-center justify-center shadow-2xl shadow-[#D4AF37]/20">
                  <User className="w-12 h-12 text-black" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{userData.fullName}</h2>
                  <p className="text-gray-400">{userData.email}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold">Active Member</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#D4AF37]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-5 hover:border-[#D4AF37]/30 transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Email Address</label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span className="text-white font-medium">{userData.email}</span>
                  </div>
                </div>

                {userData.phone && (
                  <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-5 hover:border-[#D4AF37]/30 transition-all duration-300">
                    <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Phone Number</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <span className="text-white font-medium">{userData.phone}</span>
                    </div>
                  </div>
                )}

                {userData.address && (
                  <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-5 md:col-span-2 hover:border-[#D4AF37]/30 transition-all duration-300">
                    <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Address</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <span className="text-white font-medium">{userData.address}</span>
                    </div>
                  </div>
                )}

                {userData.city && (
                  <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-5 hover:border-[#D4AF37]/30 transition-all duration-300">
                    <label className="block text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">City</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <span className="text-white font-medium">{userData.city}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#F4D03F]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-white">All Appointments</h3>
              </div>
              <span className="text-sm text-gray-400">{appointments.length} total</span>
            </div>

            {appointments.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">No appointments yet</p>
                <p className="text-sm text-gray-500 mt-2">Book an appointment to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50 border-b border-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Date & Time</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Barber</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Services</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/50">
                    {appointments.map(apt => {
                      const totalDuration = apt.services?.reduce((sum, s) => {
                        const duration = parseInt(s.duration) || 0;
                        return sum + duration;
                      }, 0) || 0;
                      
                      const canCancel = (apt.status === 'pending' || apt.status === 'confirmed') && 
                                       new Date(apt.date) > new Date();
                      
                      return (
                        <tr key={apt._id} className="hover:bg-gray-900/30 transition-colors duration-200">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#D4AF37]">
                              #{apt._id?.slice(-6).toUpperCase() || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-white">{new Date(apt.date).toLocaleDateString('en-GB')}</div>
                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {apt.time || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-9 h-9 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-400" />
                              </div>
                              <span className="text-sm font-medium text-white">{apt.barber?.name || 'Not Assigned'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="max-w-xs space-y-1">
                              {apt.services?.map((s, i) => (
                                <div key={i} className="text-xs text-gray-400">
                                  • {s.name} <span className="text-gray-500">({s.price})</span>
                                </div>
                              )) || <span className="text-xs text-gray-500">N/A</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-300">
                              {totalDuration > 0 ? `${totalDuration} min` : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-lg font-bold text-[#D4AF37]">
                              £{apt.totalPrice?.toFixed(2) || '0.00'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                              apt.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              apt.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              apt.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                              apt.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                              'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {apt.status === 'completed' && <Check className="w-3 h-3" />}
                              {apt.status === 'cancelled' && <X className="w-3 h-3" />}
                              {apt.status === 'pending' && <Clock className="w-3 h-3" />}
                              {apt.status?.charAt(0).toUpperCase() + apt.status?.slice(1) || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {canCancel ? (
                              <button
                                onClick={() => handleCancelAppointment(apt._id)}
                                disabled={cancellingId === apt._id}
                                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {cancellingId === apt._id ? (
                                  <>
                                    <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                    Cancelling...
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3 h-3" />
                                    Cancel
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-xs text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
              <div className="px-6 py-5 border-b border-gray-700/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/20 to-[#F4D03F]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-white">Account Settings</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-5 hover:border-[#D4AF37]/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Notifications</h4>
                        <p className="text-sm text-gray-400">Manage your notification preferences</p>
                      </div>
                    </div>
                    <div className="text-gray-500">→</div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-5 hover:border-[#D4AF37]/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Payment Methods</h4>
                        <p className="text-sm text-gray-400">Manage your saved payment methods</p>
                      </div>
                    </div>
                    <div className="text-gray-500">→</div>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl border border-gray-700/50 p-5 hover:border-[#D4AF37]/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                        <User className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Edit Profile</h4>
                        <p className="text-sm text-gray-400">Update your personal information</p>
                      </div>
                    </div>
                    <div className="text-gray-500">→</div>
                  </div>
                </div>

                <div className="bg-red-500/10 rounded-xl border border-red-500/30 p-5 hover:border-red-500/50 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-400">Delete Account</h4>
                        <p className="text-sm text-gray-400">Permanently delete your account and data</p>
                      </div>
                    </div>
                    <div className="text-gray-500">→</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;