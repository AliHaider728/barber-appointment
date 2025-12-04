import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, Clock, DollarSign, LogOut, 
  CheckCircle, AlertCircle,
  Scissors, MapPin, Award, User, Menu, X, Home, RefreshCw,
  CreditCard, Briefcase
} from 'lucide-react';

const API_BASE = 'https://barber-appointment-backend.vercel.app/api';

const BarberDashboard = () => {
  const [barberData, setBarberData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingAmount: 0,
    todayAppointments: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // New states for leaves
  const [leaves, setLeaves] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
    date: '',
    reason: ''
  });

  useEffect(() => {
    let mounted = true;
    
    const initDashboard = async () => {
      if (!mounted) return;
      
      try {
        await checkAuthAndLoadData();
      } catch (error) {
        console.error('Dashboard init failed:', error);
        if (mounted) {
          setError(error.message);
        }
      }
    };

    initDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      console.log('Starting authentication check...');
      
      // Use custom auth from localStorage (no Supabase)
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');
      
      if (!token || !userData) {
        console.error('No token or user data');
        throw new Error('No valid authentication found');
      }

      const parsedData = JSON.parse(userData);
      const role = localStorage.getItem('user-role');
      
      if (role !== 'barber') {
        throw new Error('Access denied - not a barber account');
      }

      const barberId = parsedData.barberId;
      if (!barberId) {
        throw new Error('Barber ID not found');
      }

      console.log('Authenticated - Barber ID:', barberId);
      
      await loadBarberData(barberId, token);
      setAuthChecked(true);
      
    } catch (error) {
      console.error('Auth failed:', error);
      setError(error.message);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    }
  };

  const loadBarberData = async (barberId, token) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📥 Loading data for barber:', barberId);

      const headers = { Authorization: `Bearer ${token}` };

      // Parallel API calls with error handling
      const [barberRes, appointmentsRes, shiftsRes, leavesRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/barbers/${barberId}`, { headers, timeout: 10000 }),
        axios.get(`${API_BASE}/appointments?barber=${barberId}`, { headers, timeout: 10000 }),
        axios.get(`${API_BASE}/barber-shifts?barber=${barberId}`, { headers, timeout: 10000 }),
        // Assuming a new endpoint for leaves
        axios.get(`${API_BASE}/leaves?barber=${barberId}`, { headers, timeout: 10000 })
      ]);

      // Handle barber data
      if (barberRes.status === 'fulfilled') {
        console.log('Barber data:', barberRes.value.data.name);
        setBarberData(barberRes.value.data);
      } else {
        console.error('Failed to load barber:', barberRes.reason);
        throw new Error('Failed to load barber profile');
      }

      // Handle appointments
      if (appointmentsRes.status === 'fulfilled') {
        const appts = appointmentsRes.value.data;
        console.log('Appointments loaded:', appts.length);
        setAppointments(Array.isArray(appts) ? appts : []);
        calculateStats(Array.isArray(appts) ? appts : []);
      } else {
        console.warn('⚠️ Failed to load appointments:', appointmentsRes.reason);
        setAppointments([]);
        calculateStats([]);
      }

      // Handle shifts
      if (shiftsRes.status === 'fulfilled') {
        const shiftData = shiftsRes.value.data;
        console.log('Shifts loaded:', shiftData.length);
        setShifts(Array.isArray(shiftData) ? shiftData : []);
      } else {
        console.warn('⚠️ Failed to load shifts:', shiftsRes.reason);
        setShifts([]);
      }

      // Handle leaves
      if (leavesRes.status === 'fulfilled') {
        const leaveData = leavesRes.value.data;
        console.log('Leaves loaded:', leaveData.length);
        setLeaves(Array.isArray(leaveData) ? leaveData : []);
      } else {
        console.warn('⚠️ Failed to load leaves:', leavesRes.reason);
        setLeaves([]);
      }

    } catch (error) {
      console.error('Load data error:', error);
      if (error.response?.status === 401) {
        setError('Session expired - please login again');
        setTimeout(() => handleLogout(), 2000);
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appts) => {
    const today = new Date().toDateString();
    
    let totalEarnings = 0;
    let pendingAmount = 0;
    let todayCount = 0;
    let completedToday = 0;

    appts.forEach(apt => {
      const aptDate = new Date(apt.date).toDateString();
      const price = parseFloat(apt.totalPrice) || 0;

      // Only count confirmed/completed for earnings
      if (apt.status === 'confirmed' || apt.status === 'completed') {
        totalEarnings += price;
      }

      // Pending payments (not paid yet)
      if (apt.paymentStatus === 'pending') {
        pendingAmount += price;
      }

      // Today's stats
      if (aptDate === today) {
        todayCount++;
        if (apt.status === 'completed') {
          completedToday++;
        }
      }
    });

    setStats({
      totalEarnings,
      pendingAmount,
      todayAppointments: todayCount,
      completedToday
    });
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Session expired!');
        handleLogout();
        return;
      }

      await axios.put(
        `${API_BASE}/appointments/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const barberId = JSON.parse(localStorage.getItem('user-data')).barberId;
      await loadBarberData(barberId, token);
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Session expired!');
        handleLogout();
        return;
      }

      const barberId = JSON.parse(localStorage.getItem('user-data')).barberId;
      await axios.post(
        `${API_BASE}/leaves`,
        { ...leaveForm, barberId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadBarberData(barberId, token);
      setLeaveForm({ date: '', reason: '' });
      alert('Leave applied successfully!');
    } catch (error) {
      console.error('Apply leave error:', error);
      alert('Failed to apply leave: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLeaveChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Error state
  if (error && !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
 
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-semibold">
            {!authChecked ? 'Authenticating...' : 'Loading dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-lg sticky top-0 z-40 border-b border-[#D4AF37]/20">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10"
              >
                {sidebarOpen ? <X /> : <Menu />}
              </button>
              <div className="flex items-center gap-2">
                <Scissors className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <h1 className="text-xl font-bold">{barberData?.name || 'Barber'}</h1>
                  <p className="text-xs text-gray-300">{barberData?.branch?.name || 'Loading...'}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold"
            >
              <LogOut className="w-4 h-4" /> 
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm`}>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold ${
                activeTab === 'overview' ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Home className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => { setActiveTab('appointments'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold ${
                activeTab === 'appointments' ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Appointments
            </button>
            <button
              onClick={() => { setActiveTab('schedule'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold ${
                activeTab === 'schedule' ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Clock className="w-5 h-5" />
              My Schedule
            </button>
            <button
              onClick={() => { setActiveTab('payments'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold ${
                activeTab === 'payments' ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              Payments
            </button>
            <button
              onClick={() => { setActiveTab('leaves'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold ${
                activeTab === 'leaves' ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Leaves
            </button>
            <button
              onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold ${
                activeTab === 'profile' ? 'bg-[#D4AF37] text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <User className="w-5 h-5" />
              My Profile
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
               
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Total</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">£{stats.totalEarnings.toFixed(2)}</h3>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">£{stats.pendingAmount.toFixed(2)}</h3>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Today</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</h3>
                  <p className="text-sm text-gray-600">Today's Bookings</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Done</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.completedToday}</h3>
                  <p className="text-sm text-gray-600">Completed Today</p>
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
                </div>
                <div className="p-6">
                  {appointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">No appointments yet</p>
                      <p className="text-sm text-gray-400 mt-1">Your bookings will appear here</p>
                    </div>
                  ) : (
                    appointments.slice(0, 5).map(apt => (
                      <div key={apt._id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{apt.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(apt.date).toLocaleDateString()} at {new Date(apt.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • £{apt.totalPrice}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Payment: {apt.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                          apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">All Appointments ({appointments.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date/Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Services</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      appointments.map(apt => (
                        <tr key={apt._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{apt.customerName}</p>
                            <p className="text-xs text-gray-500">{apt.email}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <p>{new Date(apt.date).toLocaleDateString()}</p>
                            <p className="text-xs">{new Date(apt.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {apt.services?.map(s => s.name).join(', ') || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">£{apt.totalPrice}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              apt.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {apt.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                              apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {apt.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                                className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                              >
                                Confirm
                              </button>
                            )}
                            {apt.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(apt._id, 'completed')}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                              >
                                Complete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                  {daysOfWeek.map((day, idx) => {
                    const shift = shifts.find(s => s.dayOfWeek === idx);
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border-2 ${
                          shift?.isOff ? 'bg-red-50 border-red-300' :
                          shift ? 'bg-green-50 border-green-300' :
                          'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <p className="text-xs font-bold text-gray-700 mb-2">{day}</p>
                        {shift ? (
                          shift.isOff ? (
                            <p className="text-sm font-bold text-red-600">Day Off</p>
                          ) : (
                            <>
                              <p className="text-sm font-bold text-gray-900">{shift.startTime}</p>
                              <p className="text-xs text-gray-600">to {shift.endTime}</p>
                            </>
                          )
                        ) : (
                          <p className="text-xs text-gray-400 italic">No shift</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.filter(apt => apt.paymentStatus).length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                          No payments found
                        </td>
                      </tr>
                    ) : (
                      appointments
                        .filter(apt => apt.paymentStatus) // Only show appointments with payment info
                        .map(apt => (
                          <tr key={apt._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{apt.customerName}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">£{apt.totalPrice}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                apt.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                {apt.paymentStatus === 'paid' ? 'Paid' : 'Unpaid/Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Leaves Tab */}
          {activeTab === 'leaves' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Apply for Leave</h3>
                </div>
                <form onSubmit={handleApplyLeave} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={leaveForm.date}
                      onChange={handleLeaveChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <textarea
                      name="reason"
                      value={leaveForm.reason}
                      onChange={handleLeaveChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      rows="3"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-black hover:text-white transition"
                  >
                    Apply Leave
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Leave History ({leaves.length})</h3>
                </div>
                <div className="p-6">
                  {leaves.length === 0 ? (
                    <p className="text-center text-gray-500">No leaves applied yet</p>
                  ) : (
                    <ul className="space-y-4">
                      {leaves.map((leave, idx) => (
                        <li key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                          <p className="font-medium text-gray-900">Date: {new Date(leave.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Reason: {leave.reason}</p>
                          <p className="text-xs text-gray-500">Status: {leave.status || 'Pending'}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && barberData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">My Profile</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <Scissors className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{barberData.name}</h2>
                    <p className="text-gray-600">{barberData.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Award className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-semibold">{barberData.experienceYears} years</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <User className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-semibold capitalize">{barberData.gender}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
                    <div className="flex items-center gap-2 text-gray-900">
                      <MapPin className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-semibold">{barberData.branch?.name}</span>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Specialties</label>
                    <div className="flex flex-wrap gap-2">
                      {barberData.specialties && barberData.specialties.length > 0 ? (
                        barberData.specialties.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-semibold border border-[#D4AF37]/30"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No specialties assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BarberDashboard;