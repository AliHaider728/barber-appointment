import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServicesTab = ({ barberData }) => {
  const [form, setForm] = useState({ name: '', duration: '', price: '' });
  const [availableServices, setAvailableServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAvailableServices();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchAvailableServices = async () => {
    try {
      const res = await axios.get(`https://barber-appointment-backend.vercel.app/api/services/gender/${barberData.gender}`);
      setAvailableServices(res.data);
    } catch (err) {
      setError('Failed to load services');
    }
  };

  const handleAddNewService = async (e) => {
    e.preventDefault();
    if (!form.name || !form.duration || !form.price) return;

    try {
      setLoading(true);
      const res = await axios.post('https://barber-appointment-backend.vercel.app/api/services/branch', {
        ...form,
        gender: barberData.gender
      }, { headers: getAuthHeaders() });
      
      // Add to specialties
      await axios.put(`https://barber-appointment-backend.vercel.app/api/barbers/${barberData._id}`, {
        specialties: [...barberData.specialties, res.data.name]
      }, { headers: getAuthHeaders() });
      
      setForm({ name: '', duration: '', price: '' });
      alert('Service added!');
      fetchAvailableServices();
    } catch (err) {
      setError('Failed to add service');
    } finally {
      setLoading(false);
    }
  };

  const handleAddExisting = async (serviceId, serviceName) => {
    try {
      await axios.put(`https://barber-appointment-backend.vercel.app/api/services/${serviceId}`, {
        $push: { branches: barberData.branch._id }
      }, { headers: getAuthHeaders() });
      
      await axios.put(`https://barber-appointment-backend.vercel.app/api/barbers/${barberData._id}`, {
        specialties: [...barberData.specialties, serviceName]
      }, { headers: getAuthHeaders() });
      
      alert('Service added to your specialties!');
      fetchAvailableServices();
    } catch (err) {
      setError('Failed to add service');
    }
  };

  const handleRemoveSpecialty = async (serviceName) => {
    try {
      await axios.put(`https://barber-appointment-backend.vercel.app/api/barbers/${barberData._id}`, {
        specialties: barberData.specialties.filter(s => s !== serviceName)
      }, { headers: getAuthHeaders() });
      
      alert('Service removed!');
      fetchAvailableServices();
    } catch (err) {
      setError('Failed to remove');
    }
  };

  return (
    <div className="space-y-6">
      <h2>Manage Services</h2>
      
      {/* Add new service form */}
      <form onSubmit={handleAddNewService}>
        <input name="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Name" />
        <input name="duration" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} placeholder="Duration" />
        <input name="price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} placeholder="Price" />
        <button type="submit" disabled={loading}>Add New Service</button>
      </form>

      {/* Available services not in specialties */}
      <h3>Available Services</h3>
      {availableServices.map(s => (
        !barberData.specialties.includes(s.name) && (
          <div key={s._id}>
            {s.name} - {s.duration} - {s.price}
            <button onClick={() => handleAddExisting(s._id, s.name)}>Add</button>
          </div>
        )
      ))}

      {/* Current specialties */}
      <h3>Your Specialties</h3>
      {barberData.specialties.map(s => (
        <div key={s}>
          {s}
          <button onClick={() => handleRemoveSpecialty(s)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default ServicesTab;