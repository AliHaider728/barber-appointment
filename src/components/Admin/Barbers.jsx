import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const Barbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', experienceYears: '', specialties: '', branch: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBarbers();
    fetchBranches();
  }, []);

  const fetchBarbers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/barbers');
      setBarbers(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load barbers: ' + (err.response?.data?.error || err.message));
      console.error('Barbers fetch error:', err.response?.data || err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/branches');
      setBranches(res.data);
    } catch (err) {
      console.error('Branches fetch error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.experienceYears || !form.specialties || !form.branch) {
      alert('All fields are required!');
      return;
    }

    const data = {
      name: form.name.trim(),
      experienceYears: Number(form.experienceYears),
      specialties: form.specialties.split(',').map(s => s.trim()).filter(s => s.length > 0),
      branch: form.branch
    };

    // Log data for debug
    console.log('Sending data:', data);

    try {
      setLoading(true);
      setError(null);
      if (editingId) {
        const res = await axios.put(`http://localhost:5000/api/barbers/${editingId}`, data);
        console.log('Update response:', res.data);
      } else {
        const res = await axios.post('http://localhost:5000/api/barbers', data);
        console.log('Create response:', res.data);
      }
      resetForm();
      fetchBarbers();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      setError('Save failed: ' + errorMsg);
      console.error('Save error:', err.response?.data || err);
      alert('Save failed: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      experienceYears: b.experienceYears,
      specialties: Array.isArray(b.specialties) ? b.specialties.join(', ') : '',
      branch: b.branch?._id || ''
    });
    setEditingId(b._id);
    setError(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this barber?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:5000/api/barbers/${id}`);
        fetchBarbers();
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', experienceYears: '', specialties: '', branch: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Barber</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="px-4 py-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Experience (years)"
            value={form.experienceYears}
            onChange={e => setForm({ ...form, experienceYears: e.target.value })}
            className="px-4 py-2 border rounded"
            min="0"
            required
          />
          <input
            placeholder="Specialties (comma separated)"
            value={form.specialties}
            onChange={e => setForm({ ...form, specialties: e.target.value })}
            className="px-4 py-2 border rounded md:col-span-1"
            required
          />
          <select
            value={form.branch}
            onChange={e => setForm({ ...form, branch: e.target.value })}
            className="px-4 py-2 border rounded"
            required
          >
            <option value="">Select Branch</option>
            {branches.map(b => (
              <option key={b._id} value={b._id}>{b.name} ({b.city})</option>
            ))}
          </select>
          <div className="md:col-span-2 flex gap-2">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#D4AF37] text-black font-bold py-2 px-6 rounded hover:bg-black hover:text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white py-2 px-6 rounded">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">All Barbers</h3>
        <div className="space-y-3">
          {loading && barbers.length === 0 ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : barbers.length === 0 ? (
            <p className="text-center text-gray-500">No barbers added yet.</p>
          ) : (
            barbers.map(b => (
              <div key={b._id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-bold">{b.name}</p>
                  <p className="text-sm text-gray-600">
                    {b.experienceYears} years | {b.specialties.join(', ')}
                  </p>
                  <p className="text-sm text-[#D4AF37]">
                    Branch: {b.branch?.name || 'Not Assigned'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(b)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                  <button onClick={() => handleDelete(b._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Barbers;