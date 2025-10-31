import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments');
      setAppointments(res.data);
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/appointments/${id}`, { status });
      fetchAppointments();
    } catch (error) {
      alert('Failed to update status');
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

  if (loading) return <p className="text-center py-8 text-gray-600">Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4">All Appointments</h3>

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-sm font-semibold">Customer</th>
              <th className="p-2 text-sm font-semibold">Email</th>
              <th className="p-2 text-sm font-semibold">Phone</th>
              <th className="p-2 text-sm font-semibold">Date & Time</th>
              <th className="p-2 text-sm font-semibold">Services</th>
              <th className="p-2 text-sm font-semibold">Total</th>
              <th className="p-2 text-sm font-semibold">Barber</th>
              <th className="p-2 text-sm font-semibold">Branch</th>
              <th className="p-2 text-sm font-semibold">Status</th>
              <th className="p-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(apt => (
              <tr key={apt._id} className="border-b hover:bg-gray-50">
                <td className="p-2 text-sm">{apt.customerName}</td>
                <td className="p-2 text-sm">{apt.email}</td>
                <td className="p-2 text-sm">{apt.phone}</td>
                <td className="p-2 text-sm">{new Date(apt.date).toLocaleString()}</td>
                <td className="p-2 text-sm">
                  {apt.services?.map(s => s.name).filter(Boolean).join(', ') || 'N/A'}
                </td>
                <td className="p-2 text-sm font-bold text-[#D4AF37]">
                  £{apt.totalPrice?.toFixed(2) || '0.00'}
                </td>
                <td className="p-2 text-sm">{apt.barber}</td>
                <td className="p-2 text-sm">{apt.branch?.name || 'N/A'}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {apt.status}
                  </span>
                </td>
                <td className="p-2">
                  {apt.status === 'pending' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(apt._id, 'confirmed')} className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">Approve</button>
                      <button onClick={() => updateStatus(apt._id, 'rejected')} className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredAppointments.map(apt => (
          <div key={apt._id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">{apt.customerName}</p>
                <p className="text-xs text-gray-600">{apt.email}</p>
                <p className="text-xs text-gray-600">{apt.phone}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {apt.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-500">Date:</span> <p className="font-medium">{new Date(apt.date).toLocaleDateString()}</p></div>
              <div><span className="text-gray-500">Time:</span> <p className="font-medium">{new Date(apt.date).toLocaleTimeString()}</p></div>
              <div>
                <span className="text-gray-500">Services:</span> 
                <p className="font-medium">
                  {apt.services?.map(s => s.name).filter(Boolean).join(', ') || 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Total:</span> 
                <p className="font-bold text-[#D4AF37]">£{apt.totalPrice?.toFixed(2) || '0.00'}</p>
              </div>
              <div><span className="text-gray-500">Barber:</span> <p className="font-medium">{apt.barber}</p></div>
              <div className="col-span-2"><span className="text-gray-500">Branch:</span> <p className="font-medium">{apt.branch?.name || 'N/A'}</p></div>
            </div>

            {apt.status === 'pending' && (
              <div className="flex gap-2 pt-2">
                <button onClick={() => updateStatus(apt._id, 'confirmed')} className="flex-1 bg-green-500 text-white px-3 py-2 rounded text-xs font-medium hover:bg-green-600">Approve</button>
                <button onClick={() => updateStatus(apt._id, 'rejected')} className="flex-1 bg-red-500 text-white px-3 py-2 rounded text-xs font-medium hover:bg-red-600">Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <p className="text-center py-8 text-gray-500 text-sm">No appointments found</p>
      )}
    </div>
  );
};

export default Appointments;