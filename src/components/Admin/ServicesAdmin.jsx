import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scissors, Plus, Edit2, Trash2, X, Clock, DollarSign } from 'lucide-react';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', duration: '', price: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setInitialLoading(true);
      const res = await axios.get('https://barber-appointment-backend.vercel.app/api/services');
      setServices(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load services. Please refresh the page.');
      console.error('Fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.duration || !form.price) {
      alert('All fields are required!');
      return;
    }

    const data = {
      name: form.name.trim(),
      duration: form.duration.trim(),
      price: form.price.trim()
    };

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        await axios.put(`https://barber-appointment-backend.vercel.app/api/services/${editingId}`, data);
      } else {
        await axios.post('https://barber-appointment-backend.vercel.app/api/services', data);
      }

      resetForm();
      fetchServices();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      setError('Save failed: ' + errorMsg);
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setForm({ 
      name: s.name, 
      duration: s.duration, 
      price: s.price 
    });
    setEditingId(s._id);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        setLoading(true);
        await axios.delete(`https://barber-appointment-backend.vercel.app/api/services/${id}`);
        fetchServices();
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', duration: '', price: '' });
    setEditingId(null);
    setError(null);
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Scissors className="w-8 h-8 text-[#D4AF37]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
            <p className="text-sm text-gray-600">Manage your barbershop services and pricing</p>
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
            {editingId ? 'Edit Service' : 'Add New Service'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Haircut"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration *
              </label>
              <input
                type="text"
                placeholder="e.g. 30 mins"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="text"
                placeholder="e.g. £25"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-2 bg-[#D4AF37] text-white font-medium rounded-lg hover:bg-[#C5A028] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editingId ? 'Update Service' : 'Add Service'}
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

      {/* Services List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Services</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {services.length} Total
            </span>
          </div>
        </div>
        
        <div className="p-6">
          {services.length === 0 ? (
            <div className="text-center py-12">
              <Scissors className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No services added yet</p>
              <p className="text-sm text-gray-500 mt-1">Add your first service using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <div 
                  key={service._id} 
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#D4AF37] hover:shadow-md transition"
                >
                  {/* Service Header */}
                  <div className="flex items-start gap-3 mb-3">
                     
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{service.name}</h4>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900 font-medium">{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-600">Price:</span>
                      <span className="text-gray-900 font-medium">{service.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleEdit(service)} 
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(service._id)} 
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

export default ServicesAdmin;