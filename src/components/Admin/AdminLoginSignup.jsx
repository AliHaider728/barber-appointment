import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();   
    setError('');

    // Validate passwords match during signup
    if (!isLogin && form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }

    const url = isLogin 
      ? 'https://barber-appointment-backend.vercel.app/api/auth/login'
      : 'https://barber-appointment-backend.vercel.app/api/auth/signup';

    setLoading(true);

    try {
      const res = await axios.post(url, {
        email: form.email,
        password: form.password
      });
      
      if (isLogin) {
        const { token, role } = res.data;
        if (role !== 'admin') {
          setLoading(false);
          return setError('Access denied. Admins only.');
        }
        localStorage.setItem('adminToken', token);
        navigate('/admin/dashboard');
      } else {
        setLoading(false);
        alert('Admin created! Now login.');
        setIsLogin(true);
        setForm({ email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      setLoading(false);
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
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#D4AF37] outline-none"
            required
            disabled={loading}
          />
          
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#D4AF37] outline-none"
              required
              disabled={loading}
            />
          )}

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-black hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              isLogin ? 'Login' : 'Create Admin'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          {isLogin ? "Don't have admin access? " : "Already admin? "}
          <button
            type="button"
            onClick={() => { 
              setIsLogin(!isLogin); 
              setError(''); 
              setForm({ email: '', password: '', confirmPassword: '' });
            }}
            className="text-[#D4AF37] font-bold hover:underline"
            disabled={loading}
          >
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginSignup;