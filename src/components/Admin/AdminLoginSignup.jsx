// src/components/Admin/AdminLoginSignup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const url = isLogin 
   ? 'https://barber-appointment-backend-444aioy78-alis-projects-58e3c939.vercel.app/api/auth/login'
  : 'https://barber-appointment-backend-444aioy78-alis-projects-58e3c939.vercel.app/api/auth/signup';

    try {
      const res = await axios.post(url, form);
      
      if (isLogin) {
        const { token, role } = res.data;
        if (role !== 'admin') {
          return setError('Access denied. Admins only.');
        }
        localStorage.setItem('adminToken', token);
        navigate('/admin/dashboard');
      } else {
        alert('Admin created! Now login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] to-[#f5f1ea] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-black text-center mb-6 text-[#D4AF37]">
          {isLogin ? 'Admin Login' : 'Admin Signup'}
        </h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="admin@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#D4AF37] outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#D4AF37] outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-black hover:text-white transition"
          >
            {isLogin ? 'Login' : 'Create Admin'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          {isLogin ? "Don't have admin access? " : "Already admin? "}
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-[#D4AF37] font-bold hover:underline"
          >
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginSignup;