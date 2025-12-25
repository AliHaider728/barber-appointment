import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Plus, Trash2, User } from 'lucide-react';

const API_BASE = 'https://barber-appointment-backend.vercel.app';

const BranchShifts = () => {
  const [barbers, setBarbers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shiftForm, setShiftForm] = useState({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '19:00',
    isOff: false
  });

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  useEffect(() => {
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (selectedBarber) {
      fetchShifts();
    }
  }, [selectedBarber]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchBarbers = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/branch-admin/barbers`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch barbers');
      const data = await response.json();
      setBarbers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/branch-admin/shifts`, {
        headers: getAuthHeaders()
      });

      // Parse body regardless of status
      const data = await response.json();

      if (!response.ok) {
        console.error('Error details from backend:', data);  // This will log the full error object
        throw new Error(data.error || data.message || 'Failed to fetch shifts');
      }
      
      const barberShifts = Array.isArray(data) 
        ? data.filter(shift => shift.barber._id === selectedBarber._id)
        : [];
      
      setShifts(barberShifts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddShift = async () => {
    if (!selectedBarber) return;

    try {
      setLoading(true);
      const payload = {
        barber: selectedBarber._id,
        dayOfWeek: shiftForm.dayOfWeek,
        isOff: shiftForm.isOff
      };

      if (!shiftForm.isOff) {
        payload.startTime = shiftForm.startTime;
        payload.endTime = shiftForm.endTime;
      }

      const response = await fetch(`${API_BASE}/api/branch-admin/shifts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to add shift');

      await fetchShifts();
      setShiftForm({ dayOfWeek: 1, startTime: '09:00', endTime: '19:00', isOff: false });
      alert('Shift added successfully!');
    } catch (err) {
      alert('Failed to add shift: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) return;

    try {
      const response = await fetch(`${API_BASE}/api/branch-admin/shifts/${shiftId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to delete shift');

      await fetchShifts();
      alert('Shift deleted successfully!');
    } catch (err) {
      alert('Failed to delete shift: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-purple-500" />
          Barber Shifts Management
        </h2>
        <p className="text-gray-600 text-sm mt-1">Create and manage barber working hours for your branch</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Barber Selection */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Barber to Manage Shifts *
        </label>
        <select
          value={selectedBarber?._id || ''}
          onChange={(e) => {
            const barber = barbers.find(b => b._id === e.target.value);
            setSelectedBarber(barber || null);
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose a barber</option>
          {barbers.map(b => (
            <option key={b._id} value={b._id}>
              {b.name} - {b.branch?.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBarber && (
        <>
          {/* Add Shift Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Working Hours for {selectedBarber.name}
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Day *</label>
                  <select
                    value={shiftForm.dayOfWeek}
                    onChange={(e) => setShiftForm({ ...shiftForm, dayOfWeek: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {daysOfWeek.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={shiftForm.startTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                    disabled={shiftForm.isOff}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={shiftForm.endTime}
                    onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                    disabled={shiftForm.isOff}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                    <input
                      type="checkbox"
                      checked={shiftForm.isOff}
                      onChange={(e) => setShiftForm({ ...shiftForm, isOff: e.target.checked })}
                      className="w-4 h-4 text-blue-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Day Off</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleAddShift}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Shift'}
              </button>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Schedule
              </h3>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                  <p className="mt-2 text-gray-600">Loading shifts...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                  {daysOfWeek.map(day => {
                    const shift = shifts.find(s => s.dayOfWeek === day.value);
                    return (
                      <div
                        key={day.value}
                        className={`p-4 rounded-lg border ${
                          shift?.isOff ? 'bg-red-50 border-red-200' :
                          shift ? 'bg-green-50 border-green-200' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <p className="text-xs font-medium mb-2 text-gray-700">{day.label}</p>
                        {shift ? (
                          <>
                            {shift.isOff ? (
                              <p className="text-sm font-medium text-red-600">Day Off</p>
                            ) : (
                              <>
                                <div className="flex items-center gap-1 text-sm mb-1">
                                  <Clock className="w-3 h-3" />
                                  <span className="font-medium">{shift.startTime}</span>
                                </div>
                                <div className="text-xs text-gray-600">to {shift.endTime}</div>
                              </>
                            )}
                            <button
                              onClick={() => handleDeleteShift(shift._id)}
                              className="mt-3 w-full p-1 text-xs bg-white hover:bg-red-100 text-red-600 rounded transition"
                            >
                              <Trash2 className="w-3 h-3 inline mr-1" />
                              Remove
                            </button>
                          </>
                        ) : (
                          <p className="text-xs text-gray-400">No shift</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {!selectedBarber && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Select a barber to manage their working hours</p>
        </div>
      )}
    </div>
  );
};

export default BranchShifts;