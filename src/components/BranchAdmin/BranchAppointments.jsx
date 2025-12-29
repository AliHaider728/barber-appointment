import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Search, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const API_BASE = 'https://barber-appointment-backend.vercel.app';

const BranchAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus, selectedDate]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `${API_BASE}/api/branch-admin/appointments`;
      const params = new URLSearchParams();
      
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (selectedDate) params.append('date', selectedDate);
      
      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();

      if (!response.ok) {
        console.error('Error details from backend:', data);
        throw new Error(data.error || data.message || 'Failed to fetch appointments');
      }

      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) return;

    try {
      const response = await fetch(`${API_BASE}/api/branch-admin/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchAppointments();
      alert('Appointment status updated successfully!');
    } catch (err) {
      alert('Failed to update appointment: ' + err.message);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = 
      apt.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.barber?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Helper function to safely render service name
  const getServiceName = (service) => {
    if (typeof service === 'string') return service;
    if (typeof service === 'object' && service !== null) {
      return service.name || service.serviceName || JSON.stringify(service);
    }
    return 'Unknown Service';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-green-500" />
          Branch Appointments
        </h2>
        <p className="text-gray-600 text-sm mt-1">View and manage appointments for your branch</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Customer name, email, barber..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Appointments</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {filteredAppointments.length} Total
            </span>
          </div>
        </div>

        <div className="p-6">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No appointments found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{appointment.customerName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {appointment.customerEmail}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {appointment.customerPhone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      {appointment.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Barber:</span>
                      <span className="text-gray-900 font-medium">
                        {appointment.barber?.name || 'Not Assigned'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Date:</span>
                      <span className="text-gray-900 font-medium">
                        {new Date(appointment.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Time:</span>
                      <span className="text-gray-900 font-medium">{appointment.timeSlot}</span>
                    </div>
                  </div>

                  {appointment.services && appointment.services.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-2">
                        {appointment.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {getServiceName(service)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {appointment.status === 'pending' && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'confirmed')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  )}

                  {appointment.status === 'confirmed' && (
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchAppointments;