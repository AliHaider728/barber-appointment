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
      setError(err.response?.data?.message || 'Something went wrong ');
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Emilys+Candy&family=Gravitas+One&family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
          
          .shiny-text {
            position: relative;
            display: inline-block;
            font-family: "Josefin Sans", sans-serif;
            font-optical-sizing: auto;
            font-weight: 400;
            font-style: normal;   
            overflow: hidden;
          }
          
          .shiny-text::after {
            content: "";
            position: absolute;
            top: 0;
            left: -150%;
            width: 150%;
            height: 100%;
            background: linear-gradient(
              90deg,
              rgba(255,255,255,0) 0%,
              rgba(255,255,255,0.8) 50%,
              rgba(255,255,255,0) 100%
            );
            animation: shine 3s linear infinite;
          }
          
          @keyframes shine {
            0%   { left: -150%; }
            100% { left: 150%; }
          }
        `}
      </style>
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-2 text-[#D4AF37] tracking-tight">
              {isLogin ? 'Admin Login' : 'Admin Signup'}
            </h2>
            <p className="text-center text-gray-500 text-sm">
              {isLogin ? 'Enter your credentials to continue' : 'Create your admin account'}
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-20 outline-none transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-20 outline-none transition-all duration-200"
                required
                disabled={loading}
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-20 outline-none transition-all duration-200"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-black font-bold py-3.5 rounded-lg hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have admin access? " : "Already an admin? "}
              <button
                type="button"
                onClick={() => { 
                  setIsLogin(!isLogin); 
                  setError(''); 
                  setForm({ email: '', password: '', confirmPassword: '' });
                }}
                className="text-[#D4AF37] font-bold hover:underline hover:text-[#b8941f] transition-colors"
                disabled={loading}
              >
                {isLogin ? 'Signup' : 'Login'}
              </button>
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <span className="text-center items-center shiny-text text-gray-700 text-sm font-medium">
              Powered By TecnoSphere
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginSignup;