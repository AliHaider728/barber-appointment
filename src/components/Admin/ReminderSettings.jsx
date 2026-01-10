import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Save, 
  Clock, 
  Mail, 
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Power,
  PowerOff
} from 'lucide-react';
import axios from 'axios';

const ReminderSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    hours: 0,
    minutes: 0,
    enabled: true,
    emailSubject: 'Appointment Reminder'
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://barber-appointment-backend.vercel.app';

  useEffect(() => {
    fetchSettings();
  }, []);

  const getAuthToken = () => {
    return localStorage.getItem('auth-token') || localStorage.getItem('adminToken');
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        showMessage('error', 'Authentication required. Please login again.');
        return;
      }

      const response = await axios.get(`${API_URL}/api/reminders/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please login again.');
      } else {
        showMessage('error', 'Failed to load reminder settings');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (reminderId, currentStatus) => {
    try {
      const token = getAuthToken();
      const updatedReminders = settings.reminders.map(r => 
        r._id === reminderId ? { ...r, enabled: !currentStatus } : r
      );

      const response = await axios.put(
        `${API_URL}/api/reminders/settings`,
        { reminders: updatedReminders },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(response.data);
      showMessage('success', `Reminder ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      showMessage('error', 'Failed to update reminder status');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showMessage('error', 'Please enter a reminder name');
      return;
    }

    const totalHours = formData.hours + (formData.minutes / 60);

    if (totalHours <= 0) {
      showMessage('error', 'Time must be greater than 0');
      return;
    }

    try {
      setSaving(true);
      const token = getAuthToken();
      
      const payload = {
        name: formData.name,
        hoursBeforeAppointment: totalHours,
        enabled: formData.enabled,
        emailSubject: formData.emailSubject
      };

      if (editingId) {
        // Update existing reminder
        const updatedReminders = settings.reminders.map(r => 
          r._id === editingId ? { ...r, ...payload } : r
        );
        
        const response = await axios.put(
          `${API_URL}/api/reminders/settings`,
          { reminders: updatedReminders },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSettings(response.data);
        showMessage('success', '✅ Reminder updated successfully');
      } else {
        // Create new reminder
        const response = await axios.post(
          `${API_URL}/api/reminders/settings/reminder`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSettings(response.data);
        showMessage('success', '✅ Reminder added successfully');
      }
      
      resetForm();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (reminder) => {
    const { hours, minutes } = convertToHoursMinutes(reminder.hoursBeforeAppointment);
    setFormData({
      name: reminder.name,
      hours,
      minutes,
      enabled: reminder.enabled,
      emailSubject: reminder.emailSubject
    });
    setEditingId(reminder._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (reminderId) => {
    if (!window.confirm('⚠️ Are you sure you want to delete this reminder? This action cannot be undone.')) return;

    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await axios.delete(
        `${API_URL}/api/reminders/settings/reminder/${reminderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(response.data);
      showMessage('success', '✅ Reminder deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete reminder');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      hours: 0,
      minutes: 0,
      enabled: true,
      emailSubject: 'Appointment Reminder'
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const convertToHoursMinutes = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return { hours, minutes };
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const formatTimeDisplay = (hours, minutes) => {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.join(' ') || '0m';
  };

  if (loading && !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading reminder settings...</p>
        </div>
      </div>
    );
  }

  const activeCount = settings?.reminders?.filter(r => r.enabled).length || 0;
  const totalCount = settings?.reminders?.length || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
        <div className="p-3 bg-gradient-to-br from-[#D4AF37] to-yellow-600 rounded-xl">
          <Bell className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reminder Settings</h2>
          <p className="text-sm text-gray-600">Configure automated appointment reminders</p>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div
          className={`mb-6 border-l-4 px-4 py-3 rounded-lg flex items-start gap-2 shadow-sm ${
            message.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-700'
              : 'bg-red-50 border-red-500 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-semibold">{message.text}</p>
          </div>
          <button 
            onClick={() => setMessage({ type: '', text: '' })}
            className="hover:opacity-70 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Reminders</p>
              <p className="text-2xl font-bold text-blue-900">{totalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <Power className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">Active</p>
              <p className="text-2xl font-bold text-green-900">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <PowerOff className="w-8 h-8 text-gray-600" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount - activeCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 How Reminders Work:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Reminders are automatically sent based on the configured time</li>
              <li>System checks every 30 minutes for upcoming appointments</li>
              <li>Each reminder is sent only once per appointment</li>
              <li>Customers receive emails at the specified time before their appointment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add/Edit Button */}
      {!showAddForm && (
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black font-bold rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Reminder
          </button>
        </div>
      )}

      {/* Add/Edit Reminder Form */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              {editingId ? (
                <>
                  <Edit className="w-5 h-5 text-blue-600" />
                  Edit Reminder
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-green-600" />
                  Add New Reminder
                </>
              )}
            </h3>
            <button 
              type="button" 
              onClick={resetForm}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reminder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., 24 Hours Before Appointment"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hours <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.hours}
                  onChange={(e) => setFormData({...formData, hours: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Minutes <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={formData.minutes}
                  onChange={(e) => setFormData({...formData, minutes: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.emailSubject}
                  onChange={(e) => setFormData({...formData, emailSubject: e.target.value})}
                  placeholder="e.g., Appointment Reminder - Barber Shop"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({...formData, enabled: e.target.checked})}
                    className="w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Enable this reminder immediately
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    {editingId ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    {editingId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingId ? 'Update Reminder' : 'Save Reminder'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminders Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
            <tr>
              <th className="p-4 text-left font-bold text-gray-700">Reminder Name</th>
              <th className="p-4 text-left font-bold text-gray-700">Time Before</th>
              <th className="p-4 text-left font-bold text-gray-700">Email Subject</th>
              <th className="p-4 text-left font-bold text-gray-700">Status</th>
              <th className="p-4 text-left font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading && !settings?.reminders?.length ? (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading reminders...</p>
                  </div>
                </td>
              </tr>
            ) : settings?.reminders?.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">No reminders found</p>
                  <p className="text-sm text-gray-500 mt-1">Create your first reminder above</p>
                </td>
              </tr>
            ) : (
              settings?.reminders?.map((reminder) => {
                const { hours, minutes } = convertToHoursMinutes(reminder.hoursBeforeAppointment);
                return (
                  <tr key={reminder._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{reminder.name}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-medium text-gray-700">
                          {formatTimeDisplay(hours, minutes)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-gray-700">{reminder.emailSubject}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          reminder.enabled
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {reminder.enabled ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                        {reminder.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleReminder(reminder._id, reminder.enabled)}
                          className={`p-2 rounded-lg transition-colors ${
                            reminder.enabled
                              ? 'text-gray-600 hover:bg-gray-100'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={reminder.enabled ? 'Disable' : 'Enable'}
                        >
                          {reminder.enabled ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Reminder"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(reminder._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Reminder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReminderSettings;