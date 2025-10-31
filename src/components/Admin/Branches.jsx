// src/pages/admin/Branches.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: '', city: '', address: '', openingHours: '', phone: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const res = await axios.get('http://localhost:5000/api/branches');
    setBranches(res.data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('city', form.city);
    formData.append('address', form.address);
    formData.append('openingHours', form.openingHours);
    formData.append('phone', form.phone);
    if (form.image) formData.append('image', form.image);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/branches/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/branches', formData);
      }
      resetForm();
      fetchBranches();
    } catch (error) {
      alert('Failed to save branch');
    }
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      city: b.city,
      address: b.address,
      openingHours: b.openingHours,
      phone: b.phone,
      image: null
    });
    setEditingId(b._id);
    setPreview(`http://localhost:5000${b.image}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this branch?')) {
      await axios.delete(`http://localhost:5000/api/branches/${id}`);
      fetchBranches();
    }
  };

  const resetForm = () => {
    setForm({ name: '', city: '', address: '', openingHours: '', phone: '', image: null });
    setEditingId(null);
    setPreview('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Branch</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="px-4 py-2 border rounded" required />
          <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="px-4 py-2 border rounded" required />
          <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="px-4 py-2 border rounded md:col-span-2" required />
          <input placeholder="Opening Hours" value={form.openingHours} onChange={e => setForm({ ...form, openingHours: e.target.value })} className="px-4 py-2 border rounded" required />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="px-4 py-2 border rounded" required />
          
          <div className="md:col-span-2">
            <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37] file:text-black hover:file:bg-black hover:file:text-white" />
            {preview && <img src={preview} alt="Preview" className="mt-4 h-32 rounded-lg" />}
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-[#D4AF37] text-black font-bold py-2 px-6 rounded hover:bg-black hover:text-white">
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="bg-gray-500 text-white py-2 px-6 rounded">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">All Branches</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {branches.map(b => (
            <div key={b._id} className="border rounded-lg p-4 flex gap-4">
              <img src={`http://localhost:5000${b.image}`} alt={b.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-bold">{b.name}</p>
                <p className="text-sm text-gray-600">{b.address}</p>
                <p className="text-sm">{b.city} | {b.openingHours}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(b)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                  <button onClick={() => handleDelete(b._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Branches;