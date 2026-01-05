import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertCircle, UserCog, Building2, Eye, EyeOff, Shield, UserCheck, Mail, Clock, Loader2 } from 'lucide-react';

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
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP verification states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingAdminId, setPendingAdminId] = useState(null);
  const [pendingEmail, setPendingEmail] = useState('');
  const [otpTimer, setOtpTimer] = useState(600); // 10 minutes

  useEffect(() => {
    fetchAdmins();
    fetchBranches();
  }, []);

  // OTP Timer countdown
  useEffect(() => {
    let interval;
    if (showOTPModal && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTPModal, otpTimer]);

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
      const headers = getAuthHeaders();
      const response = await fetch(`${API_BASE}/api/admins`, { headers });
      if (!response.ok) throw new Error('Failed to fetch admins');
      const data = await response.json();
      setAdmins(data);
    } catch (err) {
      console.error('[FETCH ADMINS ERROR]', err);
      setError(err.message);
      setAdmins([]);
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/branches`);
      const data = await response.json();
      setBranches(data);
    } catch (err) {
      console.error('[FETCH BRANCHES ERROR]', err);
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
        // Update existing admin
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
        
        setSuccess('✅ Admin updated successfully');
        await fetchAdmins();
        resetForm();
        setTimeout(() => setSuccess(''), 5000);
      } else {
        // Create new admin - request OTP
        if (!formData.password) {
          throw new Error('Password is required');
        }
        dataToSend.password = formData.password;
        
        const response = await fetch(`${API_BASE}/api/admins/request-creation`, {
          method: 'POST',
          headers,
          body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Creation failed');
        }
        
        const result = await response.json();
        
        // Show OTP modal
        setPendingAdminId(result.adminId);
        setPendingEmail(result.email);
        setShowOTPModal(true);
        setOtpTimer(600);
        setSuccess('📧 Verification code sent to ' + result.email);
      }
    } catch (err) {
      console.error('[HANDLE SUBMIT ERROR]', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_BASE}/api/admins/verify-otp`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          adminId: pendingAdminId,
          otp: otp
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      setSuccess('✅ Admin verified and activated successfully!');
      setShowOTPModal(false);
      setOtp('');
      setPendingAdminId(null);
      setPendingEmail('');
      await fetchAdmins();
      resetForm();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('[VERIFY OTP ERROR]', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      const headers = getAuthHeaders();
      
      const response = await fetch(`${API_BASE}/api/admins/resend-otp`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ adminId: pendingAdminId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Resend failed');
      }

      setOtpTimer(600);
      setSuccess('📧 New verification code sent!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('[RESEND OTP ERROR]', err);
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
    if (!confirm('⚠️ Delete this admin? This action cannot be undone.')) return;
    
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
      
      setSuccess('✅ Admin deleted successfully');
      await fetchAdmins();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('[DELETE ERROR]', err);
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
        <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full text-xs font-bold items-center gap-1 inline-flex">
          <Shield className="w-3 h-3" />
          Main Admin
        </span>
      );
    }
    return (
      <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-full text-xs font-bold items-center gap-1 inline-flex">
        <UserCheck className="w-3 h-3" />
        Branch Admin
      </span>
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Initial loading screen
  if (initialLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold text-lg">Loading Admin Panel...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* OTP Verification Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Verify Email</h3>
              <p className="text-gray-600 text-sm">
                We've sent a 6-digit code to<br />
                <span className="font-semibold text-gray-800">{pendingEmail}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
                <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
                <p className="text-sm font-semibold">{success}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                placeholder="000000"
                maxLength={6}
                disabled={loading}
              />
              
              <div className="flex items-center justify-center gap-2 mt-3 text-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className={`font-semibold ${otpTimer < 60 ? 'text-red-600' : 'text-gray-600'}`}>
                  {formatTime(otpTimer)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & Create Account'
                )}
              </button>

              <button
                onClick={handleResendOTP}
                disabled={loading || otpTimer > 540}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {otpTimer > 540 ? `Resend available in ${formatTime(otpTimer - 540)}` : 'Resend Code'}
              </button>

              <button
                onClick={() => {
                  setShowOTPModal(false);
                  setOtp('');
                  setPendingAdminId(null);
                  setPendingEmail('');
                  setError('');
                  setSuccess('');
                }}
                disabled={loading}
                className="w-full py-3 text-gray-600 hover:text-gray-800 font-semibold disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div className="p-3 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-xl">
          <UserCog className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Administrators</h2>
          <p className="text-sm text-gray-600">Create and manage Main & Branch Admins</p>
        </div>
      </div>
      
      {/* Error Alert */}
      {error && !showOTPModal && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-start gap-2 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {success && !showOTPModal && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-lg mb-4 shadow-sm">
          <p className="font-semibold">{success}</p>
        </div>
      )}

      {/* Admin Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-sm text-purple-700 font-medium">Main Admins</p>
              <p className="text-2xl font-bold text-purple-900">
                {admins.filter(a => a.role === 'main_admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-yellow-700 font-medium">Branch Admins</p>
              <p className="text-2xl font-bold text-yellow-900">
                {admins.filter(a => a.role === 'branch_admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Branches</p>
              <p className="text-2xl font-bold text-blue-900">{branches.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-8 border border-gray-200">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          {editingId ? (
            <>
              <Edit className="w-5 h-5 text-blue-600" />
              Edit Admin
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 text-green-600" />
              Add New Admin
            </>
          )}
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password {editingId ? '(Leave blank to keep current)' : <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all pr-12"
                  placeholder="••••••••"
                  minLength={6}
                  required={!editingId}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!editingId && (
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Admin Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value, assignedBranch: e.target.value === 'main_admin' ? '' : formData.assignedBranch})}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                required
                disabled={loading}
              >
                <option value="branch_admin">Branch Admin (Limited Access)</option>
                <option value="main_admin">Main Admin (Full Access)</option>
              </select>
            </div>
            
            {formData.role === 'branch_admin' && ( 
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 inline mr-1" />
                  Assigned Branch <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.assignedBranch}
                  onChange={(e) => setFormData({...formData, assignedBranch: e.target.value})}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required={formData.role === 'branch_admin'}
                  disabled={loading}
                >
                  <option value="">-- Select a branch --</option>
                  {branches.map(branch => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name} - {branch.city} ({branch.address})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Branch Admin will only manage this specific branch
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {editingId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {editingId ? 'Update Admin' : 'Create Admin'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Admins Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              <th className="p-4 text-left font-bold text-gray-700">Name</th>
              <th className="p-4 text-left font-bold text-gray-700">Email</th>
              <th className="p-4 text-left font-bold text-gray-700">Role</th>
              <th className="p-4 text-left font-bold text-gray-700">Branch</th>
              <th className="p-4 text-left font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                  <UserCog className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">No admins found</p>
                  <p className="text-sm text-gray-500 mt-1">Create your first admin above</p>
                </td>
              </tr>
            ) : (
              admins.map(admin => (
                <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-gray-900">{admin.fullName}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-gray-700">{admin.email}</p>
                  </td>
                  <td className="p-4">{getRoleBadge(admin.role)}</td>
                  <td className="p-4">
                    {admin.assignedBranch ? (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-700">
                          {admin.assignedBranch.name}
                          <span className="text-gray-500"> - {admin.assignedBranch.city}</span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">All Branches</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(admin)}
                        disabled={loading}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit Admin"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Admin"
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
       {/* Info Footer */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 Admin Creation Process:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>When you create a new admin, they will receive a 6-digit OTP via email</li>
              <li>Enter the OTP to verify their email and activate the account</li>
              <li>After verification, they can log in with their email and password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;

      