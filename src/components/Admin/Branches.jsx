import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', city: '', address: '', openingHours: '', phone: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const res = await axios.get('http://localhost:5000/api/branches');
    setBranches(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/api/branches/${editingId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/branches', form);
    }
    resetForm();
    fetchBranches();
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      city: b.city,
      address: b.address,
      openingHours: b.openingHours,
      phone: b.phone
    });
    setEditingId(b._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this branch?')) {
      await axios.delete(`http://localhost:5000/api/branches/${id}`);
      fetchBranches();
    }
  };

  const resetForm = () => {
    setForm({ name: '', city: '', address: '', openingHours: '', phone: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Branch</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-4 py-2 border rounded" required />
          <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="px-4 py-2 border rounded" required />
          <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="px-4 py-2 border rounded md:col-span-2" required />
          <input placeholder="Opening Hours (e.g. 09:00 - 19:00)" value={form.openingHours} onChange={e => setForm({ ...form, openingHours: e.target.value })} className="px-4 py-2 border rounded" required />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-4 py-2 border rounded" required />
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
        <h3 className="text-xl font-bold mb-4">All Branches</h3>
        <div className="space-y-3">
          {branches.map(b => (
            <div key={b._id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-bold">{b.name}</p>
                <p className="text-sm text-gray-600">{b.address}</p>
                <p className="text-sm">{b.city} | {b.openingHours} | {b.phone}</p>
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

export default Branches;