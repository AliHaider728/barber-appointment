import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, UserCog, Building2, Eye, EyeOff } from 'lucide-react';

const API_BASE = 'https://barber-appointment-backend.vercel.app';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'branch_admin',
    assignedBranch: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchAdmins();
    fetchBranches();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    if (!token) throw new Error('No authentication token found.');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE}/api/admins`, { headers });
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      setError(err.message);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/branches`);
      const data = await response.json();
      setBranches(data);
    } catch (err) {
      console.error('Failed to fetch branches:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
      };

      if (formData.role === 'branch_admin') {
        if (!formData.assignedBranch) {
          throw new Error('Please select a branch for Branch Admin');
        }
        dataToSend.assignedBranch = formData.assignedBranch;
      }
      
      if (editingId) {
        if (formData.password && formData.password.trim() !== '') {
          dataToSend.password = formData.password;
        }
        
        const response = await fetch(`${API_BASE}/api/admins/${editingId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Update failed');
        }
        
        setSuccess('Admin updated successfully');
      } else {
        if (!formData.password) {
          throw new Error('Password is required');
        }
        dataToSend.password = formData.password;
        
        const response = await fetch(`${API_BASE}/api/admins`, {
          method: 'POST',
          headers,
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Creation failed');
        }
        
        setSuccess('Admin created successfully');
      }
      
      fetchAdmins();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin) => {
    setFormData({
      fullName: admin.fullName,
      email: admin.email,
      password: '',
      role: admin.role,
      assignedBranch: admin.assignedBranch?._id || ''
    });
    setEditingId(admin._id);
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this admin?')) return;
    
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE}/api/admins/${id}`, {
        method: 'DELETE',
        headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Delete failed');
      }
      
      setSuccess('Admin deleted');
      fetchAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ 
      fullName: '', 
      email: '', 
      password: '', 
      role: 'branch_admin',
      assignedBranch: ''
    });
    setEditingId(null);
    setShowPassword(false);
  };

  const getRoleBadge = (role) => {
    if (role === 'main_admin') {
      return (
        <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-xs font-bold">
          Main Admin
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-xs font-bold">
        Branch Admin
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <UserCog className="w-8 h-8 text-[#D4AF37]" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Admins</h2>
          <p className="text-sm text-gray-600">Create and manage administrators</p>
        </div>
      </div>
      
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

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold mb-4">{editingId ? 'Edit Admin' : 'Add New Admin'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password {editingId && '(Leave blank to keep)'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] pr-10"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Admin Type *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value, assignedBranch: ''})}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              <option value="branch_admin">Branch Admin</option>
              <option value="main_admin">Main Admin</option>
            </select>
          </div>
          
          {formData.role === 'branch_admin' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Branch *
              </label>
              <select
                value={formData.assignedBranch}
                onChange={(e) => setFormData({...formData, assignedBranch: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                <option value="">Select a branch...</option>
                {branches.map(branch => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name} - {branch.city}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex gap-3">
          {editingId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#C5A028] disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Processing...' : (editingId ? 'Update' : 'Add Admin')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Email</th>
              <th className="p-3 text-left font-semibold">Role</th>
              <th className="p-3 text-left font-semibold">Branch</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && !admins.length ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            ) : (
              admins.map(admin => (
                <tr key={admin._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{admin.fullName}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">{getRoleBadge(admin.role)}</td>
                  <td className="p-3">
                    {admin.assignedBranch ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{admin.assignedBranch.name} - {admin.assignedBranch.city}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">All Branches</span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
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

export default ManageAdmins;