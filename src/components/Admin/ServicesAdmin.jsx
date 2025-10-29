import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', duration: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    const res = await axios.get('http://localhost:5000/api/services');
    setServices(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/api/services/${editingId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/services', form);
    }
    setForm({ name: '', duration: '', price: '' });
    setEditingId(null);
    fetchServices();
  };

  const handleEdit = (s) => {
    setForm({ name: s.name, duration: s.duration, price: s.price });
    setEditingId(s._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      await axios.delete(`http://localhost:5000/api/services/${id}`);
      fetchServices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Add'} Service</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="px-4 py-2 border rounded" required />
          <input placeholder="Duration" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="px-4 py-2 border rounded" required />
          <input placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="px-4 py-2 border rounded" required />
          <button type="submit" className="bg-[#D4AF37] text-black font-bold py-2 rounded hover:bg-black hover:text-white">
            {editingId ? 'Update' : 'Add'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">All Services</h3>
        <div className="grid gap-4">
          {services.map(s => (
            <div key={s._id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-gray-600">{s.duration} | {s.price}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(s)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                <button onClick={() => handleDelete(s._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesAdmin;