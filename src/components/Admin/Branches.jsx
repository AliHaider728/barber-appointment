import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Plus, Edit2, Trash2, X, Clock, Phone, Image as ImageIcon, Building2 } from 'lucide-react';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    city: '', 
    address: '', 
    openingHours: '', 
    phone: '', 
    image: null 
  });
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setInitialLoading(true);
      const res = await axios.get('https://barber-appointment-backend.vercel.app/api/branches');
      setBranches(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load branches. Please refresh the page.');
      console.error('Fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.city || !form.address || !form.openingHours || !form.phone) {
      alert('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('city', form.city.trim());
    formData.append('address', form.address.trim());
    formData.append('openingHours', form.openingHours.trim());
    formData.append('phone', form.phone.trim());
    if (form.image) formData.append('image', form.image);

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        await axios.put(`https://barber-appointment-backend.vercel.app/api/branches/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('https://barber-appointment-backend.vercel.app/api/branches', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      resetForm();
      fetchBranches();
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
      city: b.city,
      address: b.address,
      openingHours: b.openingHours,
      phone: b.phone,
      image: null
    });
    setEditingId(b._id);
    setPreview(`http://localhost:5000${b.image}`);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        setLoading(true);
        await axios.delete(`https://barber-appointment-backend.vercel.app/api/branches/${id}`);
        fetchBranches();
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', city: '', address: '', openingHours: '', phone: '', image: null });
    setEditingId(null);
    setPreview('');
    setError(null);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading branches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Branches Management</h2>
            <p className="text-sm text-gray-600">Manage your barbershop locations and details</p>
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
            {editingId ? 'Edit Branch' : 'Add New Branch'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Downtown Branch"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                placeholder="e.g. London"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Address *
              </label>
              <input
                type="text"
                placeholder="e.g. 123 High Street, Downtown"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Opening Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours *
              </label>
              <input
                type="text"
                placeholder="e.g. Mon-Fri: 9AM-6PM"
                value={form.openingHours}
                onChange={e => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. +44 20 1234 5678"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37] file:text-white hover:file:bg-[#C5A028] file:cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
              
              {preview && (
                <div className="mt-4 relative inline-block">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-40 w-auto rounded-lg border border-gray-200 object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview('');
                      setForm({ ...form, image: null });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-[#D4AF37] text-white font-medium rounded-lg hover:bg-[#C5A028] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editingId ? 'Update Branch' : 'Add Branch'}
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

      {/* Branches List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Branches</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {branches.length} Total
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {branches.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No branches added yet</p>
              <p className="text-sm text-gray-500 mt-1">Add your first branch location using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {branches.map(branch => (
                <div 
                  key={branch._id} 
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#D4AF37] hover:shadow-md transition"
                >
                  {/* Image */}
                  {branch.image ? (
                    <img 
                      src={`http://localhost:5000${branch.image}`} 
                      alt={branch.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-48 bg-gray-100 hidden items-center justify-center"
                    style={{ display: branch.image ? 'none' : 'flex' }}
                  >
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <h4 className="font-bold text-lg text-gray-900 mb-3">{branch.name}</h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-900">{branch.address}</p>
                          <p className="text-gray-600">{branch.city}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900">{branch.openingHours}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-900">{branch.phone}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleEdit(branch)} 
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(branch._id)} 
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
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

export default Branches;