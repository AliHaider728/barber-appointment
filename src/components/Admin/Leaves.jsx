import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Plus, Edit2, Trash2, X, Check, AlertCircle, Calendar, User } from 'lucide-react';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [form, setForm] = useState({
    barber: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      const [leavesRes, barbersRes] = await Promise.all([
        axios.get('https://barber-appointment-backend.vercel.app/api/leaves'),
        axios.get('https://barber-appointment-backend.vercel.app/api/barbers')
      ]);
      setLeaves(leavesRes.data);
      setBarbers(barbersRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error('Fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.barber || !form.date || !form.startTime || !form.endTime) {
      setError('Barber, date, start time, and end time are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (editingId) {
        await axios.put(`https://barber-appointment-backend.vercel.app/api/leaves/${editingId}`, form);
      } else {
        await axios.post('https://barber-appointment-backend.vercel.app/api/leaves', form);
      }
      
      resetForm();
      fetchData();
    } catch (err) {
      setError('Save failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leave) => {
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    setForm({
      barber: leave.barber._id,
      date: start.toISOString().split('T')[0],
      startTime: start.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      endTime: end.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
      reason: leave.reason
    });
    setEditingId(leave._id);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this leave request?')) return;
    try {
      await axios.delete(`https://barber-appointment-backend.vercel.app/api/leaves/${id}`);
      fetchData();
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`https://barber-appointment-backend.vercel.app/api/leaves/${id}`, { status });
      fetchData();
    } catch (err) {
      setError('Status update failed');
    }
  };

  const resetForm = () => {
    setForm({ barber: '', date: '', startTime: '', endTime: '', reason: '' });
    setEditingId(null);
  };

  if (initialLoading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leaves Management</h2>
            <p className="text-sm text-gray-600">Manage barber leave requests</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <div className="bg-red-50 p-4 rounded-lg text-red-600">{error}</div>}

      {/* Form */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Leave' : 'Add New Leave'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Barber *</label>
              <select
                value={form.barber}
                onChange={e => setForm({...form, barber: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select Barber</option>
                {barbers.map(b => (
                  <option key={b._id} value={b._id}>{b.name} - {b.branch?.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <input
                type="time"
                value={form.startTime}
                onChange={e => setForm({...form, startTime: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time *</label>
              <input
                type="time"
                value={form.endTime}
                onChange={e => setForm({...form, endTime: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input
                type="text"
                value={form.reason}
                onChange={e => setForm({...form, reason: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg"
          >
            {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
          </button>
        </form>
      </div>

      {/* Leaves List */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">All Leaves</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Barber</th>
                <th className="p-3 text-left">Date & Time</th>
                <th className="p-3 text-left">Reason</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave._id} className="border-t">
                  <td className="p-3">{leave.barber.name}</td>
                  <td className="p-3">
                    {new Date(leave.startDate).toLocaleDateString()} ({new Date(leave.startDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - {new Date(leave.endDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})})
                  </td>
                  <td className="p-3">{leave.reason}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    {leave.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(leave._id, 'approved')}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleEdit(leave)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(leave._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-3 text-center">No leaves found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaves;