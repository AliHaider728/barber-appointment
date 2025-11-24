import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Mail, Phone, Scissors, MapPin, DollarSign, Filter, Search } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Safe rendering helper
  const safeString = (value) => {
    if (!value) return 'N/A';
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.name) return value.name;
    return 'N/A';
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('https://barber-appointment-backend.vercel.app/api/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await axios.put(`https://barber-appointment-backend.vercel.app/api/appointments/${id}`, { status });
      await fetchAppointments();
    } catch (error) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch = 
      apt.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#D4AF37] border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-black text-white flex items-center gap-2">
          <Calendar className="w-7 h-7" />
          All Appointments
        </h3>
        <p className="text-white/90 mt-1 text-sm">Manage and track all customer bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition"
            />
          </div>
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-gray-800">{appointments.length}</p>
            <p className="text-xs text-gray-600 mt-1">Total</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">{appointments.filter(a => a.status === 'pending').length}</p>
            <p className="text-xs text-yellow-700 mt-1">Pending</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{appointments.filter(a => a.status === 'confirmed').length}</p>
            <p className="text-xs text-green-700 mt-1">Confirmed</p>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{appointments.filter(a => a.status === 'rejected').length}</p>
            <p className="text-xs text-red-700 mt-1">Rejected</p>
          </div>
        </div>
      </div>
      

      {/* Desktop Table */}
      <div className="hidden xl:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                <th className="w-[14%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                <th className="w-[10%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date & Time</th>
                <th className="w-[15%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Services</th>
                <th className="w-[9%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Barber</th>
                <th className="w-[9%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Branch</th>
                <th className="w-[7%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                <th className="w-[9%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="w-[17%] px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map(apt => (
                <tr key={apt._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <span className="font-medium text-sm text-gray-900 line-clamp-2">{apt.customerName}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="truncate">{apt.email}</div>
                      <div className="truncate">{apt.phone}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1 text-xs">
                      <div className="text-gray-900 font-medium whitespace-nowrap">{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="text-gray-600 whitespace-nowrap">{new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-xs text-gray-700 line-clamp-2">
                      {apt.services?.map(s => s.name).filter(Boolean).join(', ') || 'N/A'}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900 line-clamp-2">
                      {safeString(apt.barber)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700 line-clamp-2">
                      {safeString(apt.branch)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="font-bold text-sm text-[#D4AF37]">£{apt.totalPrice?.toFixed(2) || '0.00'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {apt.status === 'pending' && (
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => updateStatus(apt._id, 'confirmed')} 
                          disabled={updatingId === apt._id}
                          className="bg-green-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-green-600 transition disabled:opacity-50 whitespace-nowrap"
                        >
                          {updatingId === apt._id ? '...' : 'Approve'}
                        </button>
                        <button 
                          onClick={() => updateStatus(apt._id, 'rejected')} 
                          disabled={updatingId === apt._id}
                          className="bg-red-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 transition disabled:opacity-50 whitespace-nowrap"
                        >
                          {updatingId === apt._id ? '...' : 'Reject'}
                        </button>
                      </div>
                    )}
                  </td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Screen */}
      <div className="xl:hidden space-y-4">
        {filteredAppointments.map(apt => (
          <div key={apt._id} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-[#D4AF37]">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{apt.customerName}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {apt.email}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                      <Phone className="w-3 h-3" />
                      {apt.phone}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {apt.status}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-medium">Date</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <Clock className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-medium">Time</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Scissors className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-medium">Services</span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {apt.services?.map(s => s.name).filter(Boolean).join(', ') || 'N/A'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <User className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-medium">Barber</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {safeString(apt.barber)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-medium">Branch</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {safeString(apt.branch)}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-lg p-3 border border-[#D4AF37]/20">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-medium">Total Price</span>
                </div>
                <p className="text-2xl font-black text-[#D4AF37]">£{apt.totalPrice?.toFixed(2) || '0.00'}</p>
              </div>

              {apt.status === 'pending' && (
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => updateStatus(apt._id, 'confirmed')} 
                    disabled={updatingId === apt._id}
                    className="flex-1 bg-green-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingId === apt._id ? 'Processing...' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => updateStatus(apt._id, 'rejected')} 
                    disabled={updatingId === apt._id}
                    className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingId === apt._id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No appointments found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Appointments;