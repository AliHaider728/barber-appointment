import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, Clock, DollarSign, LogOut, 
  CheckCircle, AlertCircle, TrendingUp,
  Scissors, MapPin, Award, User, Menu, X, Home
} from 'lucide-react';

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
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'barber') {
      navigate('/login');
      return;
    }
    loadBarberData();
  }, []);

  const loadBarberData = async () => {
    try {
      const token = localStorage.getItem('jwt-token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (!token || !user?.barberRef) {
        navigate('/login');
        return;
      }

      // Fetch barber details
      const barberRes = await axios.get(
        `https://barber-appointment-backend.vercel.app/api/barbers/${user.barberRef}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBarberData(barberRes.data);

      // Fetch appointments
      const appointmentsRes = await axios.get(
        `https://barber-appointment-backend.vercel.app/api/appointments?barber=${user.barberRef}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(appointmentsRes.data);

      // Fetch shifts
      const shiftsRes = await axios.get(
        `https://barber-appointment-backend.vercel.app/api/barber-shifts?barber=${user.barberRef}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShifts(shiftsRes.data);

      calculateStats(appointmentsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      if (error.response?.status === 401) {
        handleLogout();
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

      if (apt.status === 'confirmed' || apt.status === 'completed') {
        totalEarnings += price;
      }

      if (apt.paymentStatus === 'pending') {
        pendingAmount += price;
      }

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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('jwt-token');
      await axios.put(
        `https://barber-appointment-backend.vercel.app/api/appointments/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadBarberData();
      alert('Status updated!');
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
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
                  <h1 className="text-xl font-bold">{barberData?.name}</h1>
                  <p className="text-xs text-gray-300">{barberData?.branch?.name}</p>
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
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>

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
                    <p className="text-gray-500 text-center py-8">No appointments yet</p>
                  ) : (
                    appointments.slice(0, 5).map(apt => (
                      <div key={apt._id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{apt.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(apt.date).toLocaleDateString()} at {apt.time} • £{apt.totalPrice}
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

          {/* Appointments */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">All Appointments</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map(apt => (
                      <tr key={apt._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{apt.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{apt.time}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">£{apt.totalPrice}</td>
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Schedule */}
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

          {/* Profile */}
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
                      {barberData.specialties?.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-sm font-semibold border border-[#D4AF37]/30"
                        >
                          {service}
                        </span>
                      ))}
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