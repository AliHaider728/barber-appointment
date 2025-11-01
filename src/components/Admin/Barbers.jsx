import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Plus, Edit2, Trash2, X, Scissors, Award, MapPin } from 'lucide-react';

const Barbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    experienceYears: '', 
    specialties: '', 
    branch: '' 
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setInitialLoading(true);
      const [barbersRes, branchesRes] = await Promise.all([
        axios.get('https://barber-appointment-backend.vercel.app/api/barbers'),
        axios.get('https://barber-appointment-backend.vercel.app/api/branches')
      ]);
      setBarbers(barbersRes.data);
      setBranches(branchesRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error('Fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchBarbers = async () => {
    try {
      const res = await axios.get('https://barber-appointment-backend.vercel.app/api/barbers');
      setBarbers(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load barbers.');
      console.error('Barbers fetch error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.experienceYears || !form.specialties || !form.branch) {
      alert('All fields are required!');
      return;
    }

    const data = {
      name: form.name.trim(),
      experienceYears: Number(form.experienceYears),
      specialties: form.specialties.split(',').map(s => s.trim()).filter(s => s.length > 0),
      branch: form.branch
    };

    try {
      setLoading(true);
      setError(null);
      
      if (editingId) {
        await axios.put(`https://barber-appointment-backend.vercel.app/api/barbers/${editingId}`, data);
      } else {
        await axios.post('https://barber-appointment-backend.vercel.app/api/barbers', data);
      }
      
      resetForm();
      fetchBarbers();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      setError('Save failed: ' + errorMsg);
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      experienceYears: b.experienceYears,
      specialties: Array.isArray(b.specialties) ? b.specialties.join(', ') : '',
      branch: b.branch?._id || ''
    });
    setEditingId(b._id);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this barber?')) {
      try {
        setLoading(true);
        await axios.delete(`https://barber-appointment-backend.vercel.app/api/barbers/${id}`);
        fetchBarbers();
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', experienceYears: '', specialties: '', branch: '' });
    setEditingId(null);
    setError(null);
  };

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
            <h2 className="text-2xl font-bold text-gray-900">Barbers Management</h2>
            <p className="text-sm text-gray-600">Manage your barber staff and their details</p>
          </div>
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
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                placeholder="Enter barber name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years) *
              </label>
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

            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialties *
              </label>
              <input
                type="text"
                placeholder="e.g. Haircut, Beard Trim, Styling"
                value={form.specialties}
                onChange={e => setForm({ ...form, specialties: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple specialties with commas</p>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch *
              </label>
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
          </div>

          {/* Action Buttons */}
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
 
                      <div>
                        <h4 className="font-bold text-gray-900">{barber.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Award className="w-4 h-4" />
                          <span>{barber.experienceYears} years experience</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2 text-sm">
                      <Scissors className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-600">Specialties:</span>
                        <p className="text-gray-900 font-medium">
                          {Array.isArray(barber.specialties) 
                            ? barber.specialties.join(', ') 
                            : barber.specialties}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Branch:</span>
                      <span className="text-gray-900 font-medium">
                        {barber.branch?.name || 'Not Assigned'}
                      </span>
                    </div>
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
    </div>
  );
};

export default Barbers;