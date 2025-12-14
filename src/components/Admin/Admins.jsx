import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const getAuthHeaders = () => {
    // Check all possible token storage keys
    const token = localStorage.getItem('auth-token') || 
                  localStorage.getItem('token') || 
                  localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      
      const headers = getAuthHeaders();
      const response = await axios.get(`${API_BASE}/api/admins`, { headers });
      
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected array');
      }
      
      setAdmins(response.data);
      console.log('Admins loaded:', response.data.length);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch admins';
      setError(errorMsg);
      setAdmins([]);
      console.error('Fetch error:', err);
      
      if (err.response?.status === 401 || err.message.includes('No authentication token')) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      if (editingId) {
        const dataToSend = {
          fullName: formData.fullName,
          email: formData.email,
        };
        
        if (formData.password && formData.password.trim() !== '') {
          dataToSend.password = formData.password;
        }
        
        await axios.put(`${API_BASE}/api/admins/${editingId}`, dataToSend, { headers });
        setSuccess('Admin updated successfully');
      } else {
        if (!formData.password) {
          throw new Error('Password is required for new admin');
        }
        
        await axios.post(`${API_BASE}/api/admins`, formData, { headers });
        setSuccess('Admin created successfully');
      }
      
      fetchAdmins();
      resetForm();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Operation failed';
      setError(errorMsg);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      password: '',
    });
    setEditingId(admin._id);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      setLoading(true);
      setError('');
      const headers = getAuthHeaders();
      
      await axios.delete(`${API_BASE}/api/admins/${id}`, { headers });
      setSuccess('Admin deleted successfully');
      fetchAdmins();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete admin';
      setError(errorMsg);
      console.error('Delete error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ fullName: '', email: '', password: '' });
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Admins</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {editingId ? '(Leave blank to keep current)' : <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required={!editingId}
              minLength={6}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#F4D03F] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Processing...' : (editingId ? 'Update Admin' : 'Add Admin')}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Role</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && !admins.length ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  Loading admins...
                </td>
              </tr>
            ) : !Array.isArray(admins) ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-red-600">
                  Error: Invalid data format
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500">
                  No admins found. Create one to get started
                </td>
              </tr>
            ) : (
              admins.map(admin => (
                <tr key={admin._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-3">{admin.fullName}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-[#D4AF37] text-black rounded text-sm">
                      {admin.role || 'admin'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit admin"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete admin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admins;