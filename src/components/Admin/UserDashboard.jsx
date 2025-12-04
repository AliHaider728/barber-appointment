import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Calendar, MapPin, Clock, Phone, Mail, User } from 'lucide-react';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
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

      // Get user info
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

      // Get user appointments - Backend will automatically filter by user
      const appoRes = await axios.get(
        'https://barber-appointment-backend.vercel.app/api/appointments',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // CLIENT-SIDE FILTER: Extra safety check
      const userAppointments = (appoRes.data || []).filter(
        apt => apt.email === user.email || apt.userId === user._id
      );

      // Sort by date (newest first)
      userAppointments.sort((a, b) => new Date(b.date) - new Date(a.date));

      setAppointments(userAppointments);
    } catch (error) {
      console.error('Load error:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Failed to load user data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#D4AF37]">My Profile</h1>
            <p className="text-sm text-gray-300">{userData.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'profile'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <User className="w-5 h-5 inline mr-2" />
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'appointments'
                ? 'bg-[#D4AF37] text-black'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            My Appointments
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{userData.fullName}</h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-gray-900">{userData.email}</span>
                </div>
              </div>

              {userData.phone && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-gray-900">{userData.phone}</span>
                  </div>
                </div>
              )}

              {userData.address && (
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-gray-900">{userData.address}</span>
                  </div>
                </div>
              )}

              {userData.city && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                  <span className="text-gray-900">{userData.city}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">My Appointments</h3>
            </div>

            {appointments.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No appointments yet</p>
                <p className="text-sm text-gray-500 mt-2">Book an appointment to get started</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Booking ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Barber</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Services</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Booked On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map(apt => {
                      const totalDuration = apt.services?.reduce((sum, s) => {
                        const duration = parseInt(s.duration) || 0;
                        return sum + duration;
                      }, 0) || 0;
                      
                      return (
                        <tr key={apt._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{apt._id?.slice(-6).toUpperCase() || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-medium">{new Date(apt.date).toLocaleDateString('en-GB')}</div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {apt.time || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              {apt.barber?.name || 'Not Assigned'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="max-w-xs">
                              {apt.services?.map((s, i) => (
                                <div key={i} className="text-xs">
                                  • {s.name} ({s.price})
                                </div>
                              )) || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {totalDuration > 0 ? `${totalDuration} min` : 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                            £{apt.totalPrice?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                              apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                              apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {apt.status?.charAt(0).toUpperCase() + apt.status?.slice(1) || 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {apt.createdAt ? new Date(apt.createdAt).toLocaleDateString('en-GB') : 'N/A'}
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
      </div>
    </div>
  );
};

export default UserDashboard; 