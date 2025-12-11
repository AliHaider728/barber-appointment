import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Edit2, Trash2, X, Check, AlertCircle, Calendar, User, Clock, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [form, setForm] = useState({
    barber: '',
    date: '',
    startTime: '',
    endTime: '',
    reason: '',
    isImportant: false
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Conflict detection states
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [currentLeaveForApproval, setCurrentLeaveForApproval] = useState(null);
  const [conflictingAppointments, setConflictingAppointments] = useState([]);
  const [availableBarbers, setAvailableBarbers] = useState([]);
  const [reassignments, setReassignments] = useState({});

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
      startTime: start.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}),
      endTime: end.toLocaleTimeString('en-GB', {hour: '2-digit', minute: '2-digit'}),
      reason: leave.reason,
      isImportant: leave.isImportant || false
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

  // Check for conflicts before approving
  const checkConflictsAndApprove = async (leave) => {
    try {
      setLoading(true);
      
      // Fetch appointments that conflict with this leave
      const date = new Date(leave.startDate).toISOString().split('T')[0];
      const response = await axios.get(
        `https://barber-appointment-backend.vercel.app/api/appointments/barber/${leave.barber._id}/date/${date}`
      );
      
      const appointments = response.data;
      
      // Filter appointments that actually conflict with leave time
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      
      const conflicts = appointments.filter(apt => {
        if (apt.status === 'rejected' || apt.status === 'cancelled') return false;
        
        const aptStart = new Date(apt.date);
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
        
        return (aptStart < leaveEnd && aptEnd > leaveStart);
      });

      if (conflicts.length > 0) {
        // Fetch full appointment details with populated fields
        const detailedConflicts = await Promise.all(
          conflicts.map(apt => 
            axios.get(`https://barber-appointment-backend.vercel.app/api/appointments/${apt._id}`)
              .then(res => res.data)
              .catch(() => apt)
          )
        );

        // Get available barbers for reassignment
        const barbersRes = await axios.get('https://barber-appointment-backend.vercel.app/api/barbers');
        const sameBranchBarbers = barbersRes.data.filter(b => {
          const leaveBranchId = leave.barber.branch?._id || leave.barber.branch;
          const barberBranchId = b.branch?._id || b.branch;
          return b._id !== leave.barber._id && leaveBranchId === barberBranchId;
        });
        
        setCurrentLeaveForApproval(leave);
        setConflictingAppointments(detailedConflicts);
        setAvailableBarbers(sameBranchBarbers);
        setConflictModalOpen(true);
      } else {
        // No conflicts, approve directly
        await approveLeaveDirectly(leave._id);
      }
    } catch (err) {
      console.error('Conflict check error:', err);
      setError('Failed to check conflicts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Approve leave directly (no conflicts)
  const approveLeaveDirectly = async (leaveId) => {
    try {
      await axios.put(`https://barber-appointment-backend.vercel.app/api/leaves/${leaveId}`, { 
        status: 'approved' 
      });
      alert('✅ Leave approved successfully!');
      fetchData();
    } catch (err) {
      setError('Approval failed');
    }
  };

  // Handle reassignment selection
  const handleReassignmentChange = (appointmentId, newBarberId) => {
    setReassignments(prev => ({
      ...prev,
      [appointmentId]: newBarberId
    }));
  };

  // ⬇️ UPDATED: Approve with reassignments + metadata ⬇️
  const approveWithReassignments = async () => {
    try {
      setLoading(true);
      
      // Validate all appointments have reassignments
      const allAssigned = conflictingAppointments.every(apt => reassignments[apt._id]);
      
      if (!allAssigned) {
        setError('Please assign all conflicting appointments to new barbers');
        setLoading(false);
        return;
      }

      // Reassign appointments WITH METADATA
      for (const apt of conflictingAppointments) {
        const newBarberId = reassignments[apt._id];
        if (newBarberId) {
          await axios.put(
            `https://barber-appointment-backend.vercel.app/api/appointments/${apt._id}`,
            { 
              barber: newBarberId,
              barberChanged: true,                    // ⬅️ Flag set karo
              originalBarber: apt.barber._id,         // ⬅️ Original barber save karo
              reassignmentReason: 'Barber leave'      // ⬅️ Reason save karo
            }
          );
          console.log(`✅ Reassigned appointment ${apt._id} to barber ${newBarberId}`);
        }
      }

      // Approve leave
      await axios.put(
        `https://barber-appointment-backend.vercel.app/api/leaves/${currentLeaveForApproval._id}`,
        { 
          status: 'approved',
          reassignedAppointments: conflictingAppointments.map(apt => ({
            appointment: apt._id,
            newBarber: reassignments[apt._id]
          }))
        }
      );

      // Close modal and refresh
      setConflictModalOpen(false);
      setCurrentLeaveForApproval(null);
      setConflictingAppointments([]);
      setReassignments({});
      fetchData();
      setError(null);
      alert(`✅ Leave approved and ${conflictingAppointments.length} appointment(s) reassigned successfully!`);
      
    } catch (err) {
      console.error('Reassignment error:', err);
      setError('Failed to reassign appointments: ' + err.message);
    } finally {
      setLoading(false);
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
    setForm({ barber: '', date: '', startTime: '', endTime: '', reason: '', isImportant: false });
    setEditingId(null);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leaves Management</h2>
            <p className="text-sm text-gray-600">Manage barber leave requests with conflict detection</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">{editingId ? 'Edit Leave' : 'Add New Leave'}</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Barber *</label>
              <select
                value={form.barber}
                onChange={e => setForm({...form, barber: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
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
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Time *</label>
              <input
                type="time"
                value={form.startTime}
                onChange={e => setForm({...form, startTime: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time *</label>
              <input
                type="time"
                value={form.endTime}
                onChange={e => setForm({...form, endTime: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Reason</label>
              <input
                type="text"
                value={form.reason}
                onChange={e => setForm({...form, reason: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="Optional: Reason for leave"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isImportant}
                  onChange={e => setForm({...form, isImportant: e.target.checked})}
                  className="w-4 h-4 text-[#D4AF37] rounded focus:ring-[#D4AF37]"
                />
                <span className="text-sm font-medium">Mark as Important/Urgent</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#C5A028] disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button 
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Leaves List */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">All Leaves ({leaves.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold">Barber</th>
                <th className="p-3 text-left text-sm font-semibold">Date & Time</th>
                <th className="p-3 text-left text-sm font-semibold">Reason</th>
                <th className="p-3 text-left text-sm font-semibold">Priority</th>
                <th className="p-3 text-left text-sm font-semibold">Status</th>
                <th className="p-3 text-left text-sm font-semibold">Reassignments</th>
                <th className="p-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{leave.barber?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <div className="font-medium">{new Date(leave.startDate).toLocaleDateString()}</div>
                      <div className="text-gray-600">
                        {new Date(leave.startDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - {new Date(leave.endDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm">{leave.reason || 'N/A'}</td>
                  <td className="p-3">
                    {leave.isImportant && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        Important
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                      leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {leave.status?.charAt(0).toUpperCase() + leave.status?.slice(1)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="text-sm font-medium">
                      {leave.reassignedAppointments?.length || 0}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      {leave.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => checkConflictsAndApprove(leave)}
                            disabled={loading}
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 transition disabled:opacity-50"
                            title="Approve (checks for conflicts)"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                            className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleEdit(leave)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(leave._id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    No leaves found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conflict Resolution Modal */}
      {conflictModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8" />
                <div>
                  <h3 className="text-xl font-bold">Appointment Conflicts Detected</h3>
                  <p className="text-sm opacity-90 mt-1">
                    {conflictingAppointments.length} appointment(s) conflict with this leave request
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Leave Request:</strong> {currentLeaveForApproval?.barber?.name} - {' '}
                  {new Date(currentLeaveForApproval?.startDate).toLocaleDateString()} ({new Date(currentLeaveForApproval?.startDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} - {new Date(currentLeaveForApproval?.endDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})})
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Please reassign the following appointments to available barbers from the same branch:
              </p>

              <div className="space-y-4">
                {conflictingAppointments.map(apt => (
                  <div key={apt._id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{apt.customerName}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {new Date(apt.date).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3" />
                            Duration: {apt.duration} minutes
                          </div>
                        </div>
                        <div className="text-sm text-gray-700 mt-2">
                          <strong>Services:</strong> {apt.services?.map(s => s.name).join(', ') || 'N/A'}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t">
                      <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                      <label className="text-sm font-medium text-gray-700">Reassign to:</label>
                      <select
                        value={reassignments[apt._id] || ''}
                        onChange={(e) => handleReassignmentChange(apt._id, e.target.value)}
                        className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                      >
                        <option value="">Select barber...</option>
                        {availableBarbers.map(b => (
                          <option key={b._id} value={b._id}>
                            {b.name} ({b.experienceYears} years exp)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t p-6 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => {
                  setConflictModalOpen(false);
                  setCurrentLeaveForApproval(null);
                  setConflictingAppointments([]);
                  setReassignments({});
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={approveWithReassignments}
                disabled={loading || conflictingAppointments.some(apt => !reassignments[apt._id])}
                className="px-6 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 transition"
              >
                {loading ? 'Processing...' : 'Approve & Reassign'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;