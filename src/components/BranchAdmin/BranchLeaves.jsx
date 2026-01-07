import React, { useState, useEffect } from 'react';
import { FileText, User, Calendar, Clock, CheckCircle, XCircle, AlertCircle, AlertTriangle, RefreshCw, ArrowRight, History } from 'lucide-react';

const API_BASE = 'https://barber-appointment-backend.vercel.app';

const BranchLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedLeave, setExpandedLeave] = useState(null);
  
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [currentLeaveForApproval, setCurrentLeaveForApproval] = useState(null);
  const [conflictingAppointments, setConflictingAppointments] = useState([]);
  const [availableBarbers, setAvailableBarbers] = useState([]);
  const [reassignments, setReassignments] = useState({});

  useEffect(() => {
    fetchLeaves();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/branch-admin/leaves`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error details from backend:', data);
        throw new Error(data.error || data.message || 'Failed to fetch leaves');
      }

      setLeaves(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkConflictsAndApprove = async (leave) => {
    try {
      setLoading(true);
      
      const date = new Date(leave.startDate).toISOString().split('T')[0];
      const response = await fetch(
        `${API_BASE}/api/appointments/barber/${leave.barber._id}/date/${date}`,
        { headers: getAuthHeaders() }
      );
      
      const appointments = await response.json();
      const leaveStart = new Date(leave.startDate);
      const leaveEnd = new Date(leave.endDate);
      
      const conflicts = appointments.filter(apt => {
        if (apt.status === 'rejected' || apt.status === 'cancelled') return false;
        
        const aptStart = new Date(apt.date);
        const aptEnd = new Date(aptStart.getTime() + apt.duration * 60000);
        
        return (aptStart < leaveEnd && aptEnd > leaveStart);
      });

      if (conflicts.length > 0) {
        const detailedConflicts = await Promise.all(
          conflicts.map(apt => 
            fetch(`${API_BASE}/api/appointments/${apt._id}`, { headers: getAuthHeaders() })
              .then(res => res.json())
              .catch(() => apt)
          )
        );

        const barbersRes = await fetch(`${API_BASE}/api/barbers`, { headers: getAuthHeaders() });
        const allBarbers = await barbersRes.json();
        const sameBranchBarbers = allBarbers.filter(b => {
          const leaveBranchId = leave.barber.branch?._id || leave.barber.branch;
          const barberBranchId = b.branch?._id || b.branch;
          return b._id !== leave.barber._id && leaveBranchId === barberBranchId;
        });
        
        setCurrentLeaveForApproval(leave);
        setConflictingAppointments(detailedConflicts);
        setAvailableBarbers(sameBranchBarbers);
        setConflictModalOpen(true);
      } else {
        await handleStatusUpdateDirect(leave._id, 'approved');
      }
    } catch (err) {
      console.error('Conflict check error:', err);
      setError('Failed to check conflicts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReassignmentChange = (appointmentId, newBarberId) => {
    setReassignments(prev => ({
      ...prev,
      [appointmentId]: newBarberId
    }));
  };

  const approveWithReassignments = async () => {
    try {
      setLoading(true);
      
      const allAssigned = conflictingAppointments.every(apt => reassignments[apt._id]);
      
      if (!allAssigned) {
        setError('Please assign all conflicting appointments to new barbers');
        setLoading(false);
        return;
      }

      const reassignmentDetails = [];

      for (const apt of conflictingAppointments) {
        const newBarberId = reassignments[apt._id];
        if (newBarberId) {
          await fetch(`${API_BASE}/api/appointments/${apt._id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              barber: newBarberId,
              barberChanged: true,
              originalBarber: apt.barber._id,
              reassignmentReason: 'Barber leave approved by branch admin'
            })
          });
          
          const newBarber = availableBarbers.find(b => b._id === newBarberId);
          reassignmentDetails.push({
            appointmentId: apt._id,
            customerName: apt.customerName,
            date: apt.date,
            services: apt.services,
            originalBarber: apt.barber,
            newBarber: newBarber
          });
        }
      }

      await fetch(`${API_BASE}/api/branch-admin/leaves/${currentLeaveForApproval._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: 'approved',
          approvedBy: 'branch-admin',
          approvedAt: new Date().toISOString(),
          reassignedAppointments: reassignmentDetails
        })
      });

      setConflictModalOpen(false);
      setCurrentLeaveForApproval(null);
      setConflictingAppointments([]);
      setReassignments({});
      fetchLeaves();
      setError(null);
      alert(`✅ Leave approved and ${conflictingAppointments.length} appointment(s) reassigned successfully!`);
      
    } catch (err) {
      console.error('Reassignment error:', err);
      setError('Failed to reassign appointments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdateDirect = async (leaveId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE}/api/branch-admin/leaves/${leaveId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          status: newStatus,
          [`${newStatus}By`]: 'branch-admin',
          [`${newStatus}At`]: new Date().toISOString()
        })
      });

      if (!response.ok) throw new Error('Failed to update leave status');

      await fetchLeaves();
      alert(`Leave request ${newStatus} successfully!`);
    } catch (err) {
      alert('Failed to update leave: ' + err.message);
    }
  };

  const handleStatusUpdate = async (leaveId, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this leave request?`)) return;
    if (newStatus === 'approved') {
      const leave = leaves.find(l => l._id === leaveId);
      if (leave) {
        await checkConflictsAndApprove(leave);
      }
    } else {
      await handleStatusUpdateDirect(leaveId, newStatus);
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    if (filterStatus === 'all') return true;
    return leave.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const pendingCount = leaves.filter(l => l.status === 'pending').length;
  const approvedCount = leaves.filter(l => l.status === 'approved').length;
  const rejectedCount = leaves.filter(l => l.status === 'rejected').length;

  if (loading && !conflictModalOpen) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading leaves...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-red-500" />
          Leave Management
        </h2>
        <p className="text-gray-600 text-sm mt-1">Approve or reject leave requests from barbers in your branch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{leaves.length}</p>
            </div>
            <FileText className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Status
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {filteredLeaves.length} Requests
            </span>
          </div>
        </div>

        <div className="p-6">
          {filteredLeaves.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No leave requests found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filter</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeaves.map((leave) => (
                <div key={leave._id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {leave.barber?.name || 'Unknown Barber'}
                          </h4>
                          <p className="text-sm text-gray-600">{leave.barber?.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(leave.status)}`}>
                          {getStatusIcon(leave.status)}
                          {leave.status.toUpperCase()}
                        </div>
                        {leave.approvedBy && (
                          <span className="text-xs text-gray-500">
                            by {leave.approvedBy}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Start:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(leave.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">End:</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(leave.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {leave.reason && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">Reason:</p>
                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {leave.reason}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        Submitted: {new Date(leave.createdAt).toLocaleString()}
                      </div>
                      
                      {leave.reassignedAppointments && leave.reassignedAppointments.length > 0 && (
                        <button
                          onClick={() => setExpandedLeave(expandedLeave === leave._id ? null : leave._id)}
                          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          <History className="w-4 h-4" />
                          {leave.reassignedAppointments.length} reassigned
                        </button>
                      )}
                    </div>

                    {leave.status === 'pending' && (
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleStatusUpdate(leave._id, 'approved')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(leave._id, 'rejected')}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {expandedLeave === leave._id && leave.reassignedAppointments && leave.reassignedAppointments.length > 0 && (
                    <div className="p-4 bg-blue-50 border-t border-blue-200">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                          <History className="w-4 h-4 text-blue-600" />
                          Reassignment History
                        </h4>
                        {leave.reassignedAppointments.map((reassign, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-blue-200 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="font-medium text-gray-700">Customer:</span>
                                <span className="ml-2">{reassign.customerName}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Date:</span>
                                <span className="ml-2">{new Date(reassign.date).toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Original Barber:</span>
                                <span className="ml-2">{reassign.originalBarber?.name}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Reassigned To:</span>
                                <span className="ml-2 text-green-600 font-medium">{reassign.newBarber?.name}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium text-gray-700">Services:</span>
                                <span className="ml-2">{reassign.services?.map(s => s.name).join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

export default BranchLeaves;