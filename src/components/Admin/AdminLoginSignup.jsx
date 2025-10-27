import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, User, Mail, ArrowRight } from 'lucide-react';

const AdminLoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('aliAdmin123@gmail.com');
  const [password, setPassword] = useState('ali123');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'aliAdmin123@gmail.com' && password === 'ali123') {
      // Simulate successful login
      window.location.href = '/admin/dashboard';
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {isLogin ? 'Admin Login' : 'Admin Signup'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Enter your email"
              />
              <Mail className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                placeholder="Enter your password"
              />
              <Lock className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-bold py-2 rounded-lg hover:bg-black hover:text-white transition"
          >
            {isLogin ? 'Login' : 'Signup'} <ArrowRight className="inline w-5 h-5" />
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#D4AF37] hover:underline"
            >
              {isLogin ? 'Signup' : 'Login'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginSignup;