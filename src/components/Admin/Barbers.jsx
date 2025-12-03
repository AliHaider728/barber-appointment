import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Edit2, Trash2, X, Award, MapPin, Clock, Calendar, User } from 'lucide-react';

const Barbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    experienceYears: '', 
    gender: '',
    services: [],
    branch: '',
    email: '',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('barbers');
  const [selectedBarber, setSelectedBarber] = useState(null);
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
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBarber) {
      fetchBarberShifts(selectedBarber._id);
    }
  }, [selectedBarber]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      const headers = getAuthHeaders();
      const [barbersRes, branchesRes, servicesRes] = await Promise.all([
        axios.get('https://barber-appointment-backend.vercel.app/api/barbers', { headers }),
        axios.get('https://barber-appointment-backend.vercel.app/api/branches', { headers }),
        axios.get('https://barber-appointment-backend.vercel.app/api/services', { headers })
      ]);
      setBarbers(barbersRes.data);
      setBranches(branchesRes.data);
      setServices(servicesRes.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError('Failed to load data. Please refresh the page.');
      }
      console.error('Fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchBarbers = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get('https://barber-appointment-backend.vercel.app/api/barbers', { headers });
      setBarbers(res.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError('Failed to load barbers.');
      }
      console.error('Barbers fetch error:', err);
    }
  };

  const fetchBarberShifts = async (barberId) => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`https://barber-appointment-backend.vercel.app/api/barber-shifts?barber=${barberId}`, { headers });
      setShifts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err.response?.status === 404) {
        setShifts([]);
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        console.error('Shifts fetch error:', err);
        setShifts([]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.experienceYears || !form.gender || form.services.length === 0 || !form.branch || !form.email) {
      alert('All fields are required!');
      return;
    }

    if (!editingId && !form.password) {
      alert('Password is required for new barbers!');
      return;
    }

    const data = {
      name: form.name.trim(),
      experienceYears: Number(form.experienceYears),
      gender: form.gender,
      specialties: form.services,
      branch: form.branch,
      email: form.email
    };

    if (form.password) {
      data.password = form.password; // Send password to backend for handling (create or update)
    }

    try {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders();
      
      let barberRes;
      if (editingId) {
        barberRes = await axios.put(`https://barber-appointment-backend.vercel.app/api/barbers/${editingId}`, data, { headers });
      } else {
        barberRes = await axios.post('https://barber-appointment-backend.vercel.app/api/barbers', data, { headers });
      }
      
      resetForm();
      fetchBarbers();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError('Save failed: ' + errorMsg);
      }
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      experienceYears: b.experienceYears,
      gender: b.gender,
      services: Array.isArray(b.specialties) ? b.specialties : [],
      branch: b.branch?._id || '',
      email: b.email || '',
      password: ''
    });
    setEditingId(b._id);
    setError(null);
    setActiveTab('barbers');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this barber? This action cannot be undone.')) {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        await axios.delete(`https://barber-appointment-backend.vercel.app/api/barbers/${id}`, { headers });
        fetchBarbers();
      } catch (err) {
        if (err.response?.status === 401) {
          alert('Authentication failed. Please login again.');
        } else {
          alert('Delete failed: ' + (err.response?.data?.error || err.message));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', experienceYears: '', gender: '', services: [], branch: '', email: '', password: '' });
    setEditingId(null);
    setError(null);
  };

  const handleServiceToggle = (serviceName) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter(s => s !== serviceName)
        : [...prev.services, serviceName]
    }));
  };

  const handleShiftSubmit = async (e) => {
    e.preventDefault();
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

      const headers = getAuthHeaders();
      await axios.post('https://barber-appointment-backend.vercel.app/api/barber-shifts', payload, { headers });
      await fetchBarberShifts(selectedBarber._id);
      setShiftForm({ dayOfWeek: 1, startTime: '09:00', endTime: '19:00', isOff: false });
      alert('Shift added successfully!');
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Authentication failed. Please login again.');
      } else {
        alert('Failed to add shift: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (window.confirm('Are you sure you want to delete this shift? This action cannot be undone.')) {
      try {
        const headers = getAuthHeaders();
        await axios.delete(`https://barber-appointment-backend.vercel.app/api/barber-shifts/${shiftId}`, { headers });
        await fetchBarberShifts(selectedBarber._id);
        alert('Shift deleted!');
      } catch (err) {
        if (err.response?.status === 401) {
          alert('Authentication failed. Please login again.');
        } else {
          alert('Failed to delete shift');
        }
      }
    }
  };

  const availableServices = services.filter(s => s.gender === form.gender);

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading barbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Barbers & Shifts Management</h2>
            <p className="text-sm text-gray-600">Manage your barber staff, services, and working schedules</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('barbers')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'barbers'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Barbers
          </button>
          <button
            onClick={() => setActiveTab('shifts')}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === 'shifts'
                ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-5 h-5 inline-block mr-2" />
            Working Hours
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Barbers Tab */}
      {activeTab === 'barbers' && (
        <>
          {/* Form */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingId ? 'Edit Barber' : 'Add New Barber'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    placeholder="Enter barber name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years) *</label>
                  <input
                    type="number"
                    placeholder="Years of experience"
                    value={form.experienceYears}
                    onChange={e => setForm({ ...form, experienceYears: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                  <select
                    value={form.gender}
                    onChange={e => setForm({ ...form, gender: e.target.value, services: [] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                  <select
                    value={form.branch}
                    onChange={e => setForm({ ...form, branch: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    required
                  >
                    <option value="">Select a branch</option>
                    {branches.map(b => (
                      <option key={b._id} value={b._id}>
                        {b.name} - {b.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (for login) *</label>
                  <input
                    type="email"
                    placeholder="barber@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingId ? 'New Password (leave blank to keep current)' : 'Initial Password *'}
                  </label>
                  <input
                    type="password"
                    placeholder={editingId ? 'Enter new password to update' : 'Set password'}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                    required={!editingId}
                  />
                </div>
              </div>

              {/* Services Selection */}
              {form.gender && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services * (Select at least one)
                  </label>
                  {availableServices.length === 0 ? (
                    <p className="text-sm text-red-600">No services available for selected gender</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {availableServices.map(service => (
                        <label
                          key={service._id}
                          className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                            form.services.includes(service.name)
                              ? 'border-[#D4AF37] bg-yellow-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.services.includes(service.name)}
                            onChange={() => handleServiceToggle(service.name)}
                            className="w-4 h-4 text-[#D4AF37] rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{service.name}</p>
                            <p className="text-xs text-gray-600">{service.price}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-6 py-2 bg-[#D4AF37] text-white font-medium rounded-lg hover:bg-[#C5A028] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Barber' : 'Add Barber'}
                </button>
                
                {editingId && (
                  <button 
                    type="button" 
                    onClick={resetForm} 
                    className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Barbers List */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Barbers</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {barbers.length} Total
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {barbers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">No barbers added yet</p>
                  <p className="text-sm text-gray-500 mt-1">Add your first barber using the form above</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {barbers.map(barber => (
                    <div 
                      key={barber._id} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#D4AF37] hover:shadow-md transition"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#D4AF37]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{barber.name}</h4>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Award className="w-4 h-4" />
                              <span>{barber.experienceYears} years • {barber.gender}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Branch */}
                      <div className="flex items-center gap-2 text-sm mb-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Branch:</span>
                        <span className="text-gray-900 font-medium">
                          {barber.branch?.name || 'Not Assigned'}
                        </span>
                      </div>

                      {/* Services - Gender Wise */}
                      <div className="space-y-3 mb-4">
                        {barber.gender === 'male' && barber.specialties?.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-blue-700 mb-1">
                              <User className="w-3 h-3" />
                              <span>Male Services ({barber.specialties.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {barber.specialties.map((service, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {barber.gender === 'female' && barber.specialties?.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1 text-xs font-semibold text-pink-700 mb-1">
                              <User className="w-3 h-3" />
                              <span>Female Services ({barber.specialties.length})</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {barber.specialties.map((service, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-xs bg-pink-50 text-pink-700 rounded-full"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {(!barber.specialties || barber.specialties.length === 0) && (
                          <p className="text-xs text-gray-400 italic">No services assigned</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => handleEdit(barber)} 
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedBarber(barber);
                            setActiveTab('shifts');
                          }} 
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                        >
                          <Clock className="w-4 h-4" />
                          Shifts
                        </button>
                        <button 
                          onClick={() => handleDelete(barber._id)} 
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Shifts Tab */}
      {activeTab === 'shifts' && (
        <>
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Barber to Manage Shifts *
            </label>
            <select
              value={selectedBarber?._id || ''}
              onChange={e => {
                const barber = barbers.find(b => b._id === e.target.value);
                setSelectedBarber(barber || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
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
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Working Hours for {selectedBarber.name}
                  </h3>
                </div>
                
                <form onSubmit={handleShiftSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Day *</label>
                      <select
                        value={shiftForm.dayOfWeek}
                        onChange={e => setShiftForm({ ...shiftForm, dayOfWeek: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
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
                        onChange={e => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                        disabled={shiftForm.isOff}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input
                        type="time"
                        value={shiftForm.endTime}
                        onChange={e => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                        disabled={shiftForm.isOff}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition disabled:bg-gray-100"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#D4AF37] transition">
                        <input
                          type="checkbox"
                          checked={shiftForm.isOff}
                          onChange={e => setShiftForm({ ...shiftForm, isOff: e.target.checked })}
                          className="w-4 h-4 text-[#D4AF37] rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Day Off</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 px-6 py-2 bg-[#D4AF37] text-white font-medium rounded-lg hover:bg-[#C5A028] transition disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Shift'}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Schedule
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {daysOfWeek.map(day => {
                      const shift = shifts.find(s => s.dayOfWeek === day.value);
                      return (
                        <div
                          key={day.value}
                          className={`p-4 rounded-lg border-2 ${
                            shift?.isOff ? 'bg-red-50 border-red-200' :
                            shift ? 'bg-green-50 border-green-200' :
                            'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <p className="text-xs font-bold mb-2 text-gray-700">{day.label}</p>
                          {shift ? (
                            <>
                              {shift.isOff ? (
                                <p className="text-sm font-bold text-red-600">Day Off</p>
                              ) : (
                                <>
                                  <div className="flex items-center gap-1 text-sm mb-1">
                                    <Clock className="w-3 h-3" />
                                    <span className="font-bold">{shift.startTime}</span>
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
                </div>
              </div>
            </>
          )}

          {!selectedBarber && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Select a barber to manage their working hours</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Barbers;