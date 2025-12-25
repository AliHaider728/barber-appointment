import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Plus, X, Clock, Edit2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = 'https://barber-appointment-backend.vercel.app/api';

const ServicesTab = ({ barberData, onUpdate }) => {
  const [form, setForm] = useState({ name: '', duration: '', price: '' });
  const [editingService, setEditingService] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchAvailableServices();
  }, [barberData.gender, barberData.branch]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // ✅ FIXED: Safely extract branch ID
  const getBranchId = () => {
    if (!barberData.branch) {
      console.error('❌ No branch data available');
      return null;
    }
    
    if (typeof barberData.branch === 'string') {
      return barberData.branch;
    }
    
    if (barberData.branch._id) {
      return barberData.branch._id;
    }
    
    console.error('❌ Invalid branch format:', barberData.branch);
    return null;
  };

  // ✅ FIXED: Fetch services filtered by barber's branch
  const fetchAvailableServices = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      
      const branchId = getBranchId();
      if (!branchId) {
        setError('Branch information not available');
        return;
      }

      // Fetch services by branch instead of gender
      const res = await axios.get(`${API_URL}/services/branch/${branchId}`);
      
      // Filter by gender if needed
      const filteredServices = res.data.filter(s => s.gender === barberData.gender.toLowerCase());
      
      console.log(`✅ Loaded ${filteredServices.length} services for branch ${branchId}`);
      setAvailableServices(filteredServices);
    } catch (err) {
      setError('Failed to load services');
      console.error('❌ Fetch services error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAddNewService = async (e) => {
    e.preventDefault();
    if (!form.name || !form.duration || !form.price) {
      setError('All fields are required!');
      return;
    }

    const branchId = getBranchId();
    if (!branchId) {
      setError('Branch information not available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const serviceData = {
        name: form.name.trim(),
        duration: form.duration.trim(),
        price: `£${form.price}`,
        gender: barberData.gender.toLowerCase(),
        branches: [branchId]
      };

      const res = await axios.post(`${API_URL}/services`, serviceData);
      
      // Add to barber's specialties
      const updatedSpecialties = [...new Set([...barberData.specialties, res.data.name])];
      
      await axios.put(
        `${API_URL}/barbers/${barberData._id}`,
        { specialties: updatedSpecialties },
        { headers: getAuthHeaders() }
      );
      
      setForm({ name: '', duration: '', price: '' });
      setSuccessMsg('Service added successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      await fetchAvailableServices();
      if (onUpdate) onUpdate();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setError('Failed to add service: ' + errMsg);
      console.error('❌ Add service error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Add existing service with proper branch handling
  const handleAddExisting = async (service) => {
    const branchId = getBranchId();
    if (!branchId) {
      setError('Branch information not available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Extract existing branch IDs
      const currentBranches = service.branches.map(b => {
        if (typeof b === 'string') return b;
        if (b && b._id) return b._id;
        return null;
      }).filter(Boolean);

      console.log('Current branches:', currentBranches);
      console.log('Adding branch:', branchId);

      // Only update service if branch not already included
      if (!currentBranches.includes(branchId)) {
        await axios.put(
          `${API_URL}/services/${service._id}`,
          {
            name: service.name,
            duration: service.duration,
            price: service.price,
            gender: service.gender,
            branches: [...currentBranches, branchId]
          }
        );
        console.log('✅ Service updated with new branch');
      }
      
      // Add to barber's specialties
      const updatedSpecialties = [...new Set([...barberData.specialties, service.name])];
      
      await axios.put(
        `${API_URL}/barbers/${barberData._id}`,
        { specialties: updatedSpecialties },
        { headers: getAuthHeaders() }
      );
      
      setSuccessMsg('Service added to your specialties!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      await fetchAvailableServices();
      if (onUpdate) onUpdate();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setError('Failed to add service: ' + errMsg);
      console.error('❌ Add existing service error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Update service with proper validation
  const handleUpdateService = async (e) => {
    e.preventDefault();
    
    if (!editingService || !form.name || !form.duration || !form.price) {
      setError('All fields are required!');
      return;
    }

    const branchId = getBranchId();
    if (!branchId) {
      setError('Branch information not available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const serviceToUpdate = availableServices.find(s => s._id === editingService._id);
      if (!serviceToUpdate) {
        setError('Service not found');
        return;
      }

      // Extract existing branch IDs
      const currentBranches = serviceToUpdate.branches.map(b => {
        if (typeof b === 'string') return b;
        if (b && b._id) return b._id;
        return null;
      }).filter(Boolean);

      // Ensure current branch is included
      const finalBranches = currentBranches.includes(branchId) 
        ? currentBranches 
        : [...currentBranches, branchId];

      // Update service
      await axios.put(
        `${API_URL}/services/${editingService._id}`,
        {
          name: form.name.trim(),
          duration: form.duration.trim(),
          price: `£${form.price}`,
          gender: serviceToUpdate.gender,
          branches: finalBranches
        }
      );

      // Update barber's specialties if name changed
      if (editingService.name !== form.name.trim()) {
        const updatedSpecialties = barberData.specialties.map(s => 
          s === editingService.name ? form.name.trim() : s
        );
        
        await axios.put(
          `${API_URL}/barbers/${barberData._id}`,
          { specialties: updatedSpecialties },
          { headers: getAuthHeaders() }
        );
      }

      setForm({ name: '', duration: '', price: '' });
      setEditingService(null);
      setSuccessMsg('Service updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      await fetchAvailableServices();
      if (onUpdate) onUpdate();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setError('Failed to update service: ' + errMsg);
      console.error('❌ Update service error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Remove specialty with proper validation
  const handleRemoveSpecialty = async (serviceName) => {
    if (!confirm(`Remove "${serviceName}" from your specialties?`)) return;
    
    if (!barberData._id) {
      setError('Invalid barber ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const updatedSpecialties = barberData.specialties.filter(s => s !== serviceName);
      
      console.log('Removing specialty:', serviceName);
      console.log('Barber ID:', barberData._id);
      console.log('Updated specialties:', updatedSpecialties);
      
      await axios.put(
        `${API_URL}/barbers/${barberData._id}`,
        { specialties: updatedSpecialties },
        { headers: getAuthHeaders() }
      );
      
      setSuccessMsg('Service removed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      
      if (onUpdate) onUpdate();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      setError('Failed to remove service: ' + errMsg);
      console.error('❌ Remove specialty error:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      duration: service.duration,
      price: service.price.replace('£', ''),
    });
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditing = () => {
    setEditingService(null);
    setForm({ name: '', duration: '', price: '' });
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

  const mySpecialties = availableServices.filter(s => barberData.specialties.includes(s.name));
  const availableToAdd = availableServices.filter(s => !barberData.specialties.includes(s.name));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-[#D4AF37]" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Services Management</h2>
              <p className="text-sm text-gray-600">Manage your service offerings and specialties</p>
            </div>
          </div>
          <button
            onClick={fetchAvailableServices}
            disabled={loading}
            className="p-2 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
            title="Refresh services"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800 flex-1">{successMsg}</p>
          <button onClick={() => setSuccessMsg('')} className="text-green-400 hover:text-green-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add/Edit Service Form */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {editingService ? (
              <>
                <Edit2 className="w-5 h-5" />
                Edit Service
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add New Service
              </>
            )}
          </h3>
          {editingService && (
            <button
              onClick={cancelEditing}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={editingService ? handleUpdateService : handleAddNewService} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name *</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none" 
                placeholder="e.g. Classic Haircut"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={form.duration} 
                  onChange={(e) => setForm({...form, duration: e.target.value})} 
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none" 
                  placeholder="e.g. 30 minutes"
                  required 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">£</span>
                <input 
                  type="text" 
                  value={form.price} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setForm({...form, price: value});
                  }} 
                  className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4AF37] outline-none" 
                  placeholder="25"
                  required 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="px-6 py-2.5 bg-[#D4AF37] text-white font-medium rounded-lg hover:bg-[#C5A028] disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {editingService ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                {editingService ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingService ? 'Update Service' : 'Add Service'}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Your Current Specialties */}
      <div className="bg-white rounded-lg shadow border">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Your Specialties</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
            {mySpecialties.length} Active
          </span>
        </div>

        <div className="p-6">
          {mySpecialties.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-base font-medium text-gray-600">No specialties added yet</p>
              <p className="text-sm text-gray-500 mt-1">Add services from the available list below</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySpecialties.map(service => (
                <div key={service._id} className="border rounded-lg p-4 hover:border-[#D4AF37] hover:shadow-md transition bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg text-gray-900">{service.name}</h4>
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#D4AF37] text-base">{service.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditing(service)} 
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => handleRemoveSpecialty(service.name)} 
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm font-medium disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Services to Add */}
      {availableToAdd.length > 0 && (
        <div className="bg-white rounded-lg shadow border">
          <div className="border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Available Services</h3>
              <p className="text-sm text-gray-600 mt-1">Services available in your branch</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {availableToAdd.length}
            </span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableToAdd.map(service => (
                <div key={service._id} className="border rounded-lg p-4 hover:border-[#D4AF37] hover:shadow-md transition">
                  <h4 className="font-bold text-lg text-gray-900 mb-3">{service.name}</h4>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#D4AF37] text-base">{service.price}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddExisting(service)} 
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] text-sm font-medium disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add to Specialties
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesTab;