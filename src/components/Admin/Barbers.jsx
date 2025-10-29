import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Barbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', experienceYears: '', specialties: '', branch: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBarbers();
    fetchBranches();
  }, []);

  const fetchBarbers = async () => {
    const res = await axios.get('http://localhost:5000/api/barbers');
    setBarbers(res.data);
  };

  const fetchBranches = async () => {
    const res = await axios.get('http://localhost:5000/api/branches');
    setBranches(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      experienceYears: Number(form.experienceYears),
      specialties: form.specialties.split(',').map(s => s.trim())
    };

    if (editingId) {
      await axios.put(`http://localhost:5000/api/barbers/${editingId}`, data);
    } else {
      await axios.post('http://localhost:5000/api/barbers', data);
    }
    resetForm();
    fetchBarbers();
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      experienceYears: b.experienceYears,
      specialties: b.specialties.join(', '),
      branch: b.branch._id
    });
    setEditingId(b._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this barber?')) {
      await axios.delete(`http://localhost:5000/api/barbers/${id}`);
      fetchBarbers();
    }
  };

  const resetForm = () => {
    setForm({ name: '', experienceYears: '', specialties: '', branch: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
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
              <option key={b._id} value={b._id}>{b.name}</option>
            ))}
          </select>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-[#D4AF37] text-black font-bold py-2 px-6 rounded hover:bg-black hover:text-white">
              {editingId ? 'Update' : 'Add'}
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
          {barbers.map(b => (
            <div key={b._id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-bold">{b.name}</p>
                <p className="text-sm text-gray-600">
                  {b.experienceYears} years | {b.specialties.join(', ')}
                </p>
                <p className="text-sm text-[#D4AF37]">Branch: {b.branch?.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(b)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Barbers;