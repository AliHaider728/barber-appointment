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
  Edit
} from 'lucide-react';
import axios from 'axios';

const ReminderSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newReminder, setNewReminder] = useState({
    name: '',
    hours: 0,
    minutes: 0,
    enabled: true,
    emailSubject: 'Appointment Reminder'
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/api/reminders/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      showMessage('error', 'Failed to load reminder settings');
    } finally {
      setLoading(false);
    }
  };

  const toggleReminder = async (index) => {
    try {
      const updatedReminders = [...settings.reminders];
      updatedReminders[index].enabled = !updatedReminders[index].enabled;

      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_URL}/api/reminders/settings`,
        { reminders: updatedReminders },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(response.data);
      showMessage('success', 'Reminder updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update reminder');
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    
    if (!newReminder.name) {
      showMessage('error', 'Please enter a reminder name');
      return;
    }

    const totalHours = newReminder.hours + (newReminder.minutes / 60);

    if (totalHours <= 0) {
      showMessage('error', 'Please set a valid time');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${API_URL}/api/reminders/settings/reminder`,
        {
          name: newReminder.name,
          hoursBeforeAppointment: totalHours,
          enabled: newReminder.enabled,
          emailSubject: newReminder.emailSubject
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(response.data);
      setShowAddForm(false);
      setNewReminder({
        name: '',
        hours: 0,
        minutes: 0,
        enabled: true,
        emailSubject: 'Appointment Reminder'
      });
      showMessage('success', '✅ Reminder added successfully');
    } catch (error) {
      showMessage('error', 'Failed to add reminder');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    if (!confirm('⚠️ Are you sure you want to delete this reminder? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(
        `${API_URL}/api/reminders/settings/reminder/${reminderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(response.data);
      showMessage('success', '✅ Reminder deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete reminder');
    }
  };

  const handleUpdateTime = async (index, hours, minutes) => {
    try {
      const updatedReminders = [...settings.reminders];
      const totalHours = parseFloat(hours) + (parseFloat(minutes) / 60);
      updatedReminders[index].hoursBeforeAppointment = totalHours;

      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${API_URL}/api/reminders/settings`,
        { reminders: updatedReminders },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings(response.data);
      showMessage('success', '✅ Time updated successfully');
    } catch (error) {
      showMessage('error', 'Failed to update time');
    }
  };

  const convertToHoursMinutes = (totalHours) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return { hours, minutes };
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading reminder settings...</p>
        </div>
      </div>
    );
  }

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
          <button onClick={() => setMessage({ type: '', text: '' })}>
            <X className="w-5 h-5 hover:opacity-70" />
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
              <p className="text-2xl font-bold text-blue-900">{settings?.reminders?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-green-700 font-medium">Active Reminders</p>
              <p className="text-2xl font-bold text-green-900">
                {settings?.reminders?.filter(r => r.enabled).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-gray-600" />
            <div>
              <p className="text-sm text-gray-700 font-medium">Inactive Reminders</p>
              <p className="text-2xl font-bold text-gray-900">
                {settings?.reminders?.filter(r => !r.enabled).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">💡 How it works:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Reminders are sent automatically based on the time you set</li>
              <li>The system checks every 30 minutes for upcoming appointments</li>
              <li>Each reminder is sent only once per appointment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Button */}
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

      {/* Add Reminder Form */}
      {showAddForm && (
        <form onSubmit={handleAddReminder} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-green-600" />
              Create New Reminder
            </h3>
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reminder Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newReminder.name}
                onChange={(e) => setNewReminder({ ...newReminder, name: e.target.value })}
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
                value={newReminder.hours}
                onChange={(e) => setNewReminder({ ...newReminder, hours: parseInt(e.target.value) || 0 })}
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
                value={newReminder.minutes}
                onChange={(e) => setNewReminder({ ...newReminder, minutes: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newReminder.emailSubject}
                onChange={(e) => setNewReminder({ ...newReminder, emailSubject: e.target.value })}
                placeholder="e.g., Appointment Reminder"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black font-bold rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Reminder
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reminders List */}
      <div className="space-y-4">
        {settings?.reminders?.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-semibold text-gray-600">No reminders configured</p>
            <p className="text-sm text-gray-500 mt-1">Click "Add New Reminder" to create your first reminder</p>
          </div>
        ) : (
          settings?.reminders?.map((reminder, index) => {
            const { hours, minutes } = convertToHoursMinutes(reminder.hoursBeforeAppointment);
            return (
              <div
                key={reminder._id}
                className={`bg-gradient-to-br p-6 rounded-xl border-2 transition-all ${
                  reminder.enabled 
                    ? 'from-white to-gray-50 border-gray-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md' 
                    : 'from-gray-50 to-gray-100 border-gray-200 opacity-75'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{reminder.name}</h3>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          reminder.enabled
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {reminder.enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-[#D4AF37]" />
                        <span>
                          Send <strong className="text-gray-900">{hours}h {minutes}m</strong> before appointment
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-medium text-gray-900">{reminder.emailSubject}</span>
                      </div>
                    </div>

                    {/* Update Time Inputs */}
                    <div className="flex items-center gap-3 mt-4 p-4 bg-white rounded-lg border border-gray-200">
                      <Edit className="w-4 h-4 text-gray-500" />
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Hours:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={hours}
                            onChange={(e) => handleUpdateTime(index, e.target.value, minutes)}
                            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 mb-1 block">
                            Minutes:
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => handleUpdateTime(index, hours, e.target.value)}
                            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => toggleReminder(index)}
                      className={`px-4 py-2.5 rounded-lg font-bold text-sm transition-all ${
                        reminder.enabled
                          ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          : 'bg-gradient-to-r from-[#D4AF37] to-yellow-600 hover:shadow-lg text-black'
                      }`}
                    >
                      {reminder.enabled ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      onClick={() => handleDeleteReminder(reminder._id)}
                      className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all hover:shadow-lg"
                      title="Delete Reminder"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReminderSettings;