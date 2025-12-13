import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_BASE ; 

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

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_BASE}/api/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Check if data is array
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response format: Expected array');
      }
      setAdmins(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admins');
      setAdmins([]); // Reset to empty array on error
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (editingId) {
        await axios.put(`${API_BASE}/api/admins/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE}/api/admins`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchAdmins();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      password: '', // Don't prefill password for security
    });
    setEditingId(admin._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE}/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdmins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete admin');
      console.error(err);
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingId ? '(Leave blank to keep current)' : ''}</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required={!editingId}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#F4D03F] disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> {editingId ? 'Update' : 'Add'} Admin
          </button>
        </div>
      </form>

      {/* Admins List */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-3 text-center">Loading...</td></tr>
            ) : !Array.isArray(admins) ? (
              <tr><td colSpan="4" className="p-3 text-center text-red-600">Error: Invalid data format</td></tr>
            ) : admins.length === 0 ? (
              <tr><td colSpan="4" className="p-3 text-center">No admins found</td></tr>
            ) : (
              admins.map(admin => (
                <tr key={admin._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{admin.fullName}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">{admin.role}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(admin._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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