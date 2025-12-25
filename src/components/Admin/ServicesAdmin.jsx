import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scissors, Plus, Edit2, Trash2, X, Clock, User, MapPin } from 'lucide-react';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', duration: '', price: '', gender: '', branches: [] });
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
      const [servicesRes, branchesRes] = await Promise.all([
        axios.get('https://barber-appointment-backend.vercel.app/api/services'),
        axios.get('https://barber-appointment-backend.vercel.app/api/branches')
      ]);
      setServices(servicesRes.data);
      setBranches(branchesRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load data. Please refresh the page.');
      console.error('Fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('https://barber-appointment-backend.vercel.app/api/services');
      setServices(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load services.');
      console.error('Fetch error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.duration.trim() || !form.price.trim() || !form.gender) {
      alert('All fields are required!');
      return;
    }

    const data = {
      name: form.name.trim(),
      duration: form.duration.trim(),
      price: `£${form.price}`,
      gender: form.gender.toLowerCase(),
      branches: form.branches
    };

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        await axios.put(`https://barber-appointment-backend.vercel.app/api/services/${editingId}`, data);
        alert('Service updated!');
      } else {
        await axios.post('https://barber-appointment-backend.vercel.app/api/services', data);
        alert('Service added!');
      }

      resetForm();
      fetchServices();
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError('Save failed: ' + msg);
      alert('Error: ' + msg);
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    const priceWithoutSymbol = s.price.replace('£', '');
    const branchIds = s.branches.map(b => typeof b === 'object' ? b._id : b);
    
    setForm({
      name: s.name,
      duration: s.duration,
      price: priceWithoutSymbol,
      gender: s.gender,
      branches: branchIds
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
        alert('Delete failed: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', duration: '', price: '', gender: '', branches: [] });
    setEditingId(null);
    setError(null);
  };

  const handleBranchToggle = (branchId) => {
    setForm(prev => ({
      ...prev,
      branches: prev.branches.includes(branchId)
        ? prev.branches.filter(id => id !== branchId)
        : [...prev.branches, branchId]
    }));
  };

  const maleServices = services.filter(s => s.gender === 'male');
  const femaleServices = services.filter(s => s.gender === 'female');

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
            <p className="text-sm text-gray-600">Add, edit, or remove barber services</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
              <input
                type="text"
                placeholder="e.g. Haircut"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
              <input
                type="text"
                placeholder="e.g. 30 minutes"
                value={form.duration}
                onChange={e => setForm({ ...form, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500 font-medium">£</span>
                <input
                  type="text"
                  placeholder="25"
                  value={form.price}
                  onChange={e => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setForm({ ...form, price: value });
                  }}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                value={form.gender}
                onChange={e => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Branches Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Branches * (Select multiple)
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {branches.map(b => (
                <label
                  key={b._id}
                  className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${form.branches.includes(b._id)
                      ? 'border-[#D4AF37] bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={form.branches.includes(b._id)}
                    onChange={() => handleBranchToggle(b._id)}
                    className="w-4 h-4 text-[#D4AF37] rounded"
                  />
                  <span className="text-sm font-medium">{b.name}</span>
                </label>
              ))}
            </div>
          </div>

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

      {/* Male Services */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4 bg-blue-50">
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <User className="w-5 h-5" /> Male Services ({maleServices.length})
          </h3>
        </div>
        <div className="p-6">
          {maleServices.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No male services yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {maleServices.map(service => (
                <ServiceCard 
                  key={service._id} 
                  service={service} 
                  branches={branches}
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Female Services */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4 bg-pink-50">
          <h3 className="text-lg font-semibold text-pink-900 flex items-center gap-2">
            <User className="w-5 h-5" /> Female Services ({femaleServices.length})
          </h3>
        </div>
        <div className="p-6">
          {femaleServices.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No female services yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {femaleServices.map(service => (
                <ServiceCard 
                  key={service._id} 
                  service={service} 
                  branches={branches}
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceCard = ({ service, branches, onEdit, onDelete }) => {
  const getBranchNames = () => {
    if (!service.branches || service.branches.length === 0) return 'No branches';
    
    return service.branches.map(branch => {
      if (typeof branch === 'object' && branch.name) {
        return branch.name;
      }
      const foundBranch = branches.find(b => b._id === branch);
      return foundBranch ? foundBranch.name : 'Unknown';
    }).join(', ');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-[#D4AF37] hover:shadow-md transition">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Scissors className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 truncate">{service.name}</h4>
          <p className="text-xs text-gray-500 capitalize">{service.gender}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">Duration:</span>
          <span className="text-gray-900 font-medium">{service.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Price:</span>
          <span className="text-[#D4AF37] font-bold">{service.price}</span>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-gray-600">Branches:</span>
            <p className="text-gray-900 font-medium text-xs mt-0.5">{getBranchNames()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(service)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(service._id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ServicesAdmin;