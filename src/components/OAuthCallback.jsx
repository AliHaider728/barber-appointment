import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from  '../lib/supabaseClient.js';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get the session from URL
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session) throw new Error('No session found');

      const user = session.user;
      const token = session.access_token;
      const role = user.user_metadata?.role || 'user';

      // Store token immediately
      localStorage.setItem('sb-token', token);
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-role', role);
      localStorage.setItem('user-id', user.id);

      // Call backend to verify role
      const verifyRes = await fetch(`https://barber-appointment-backend.vercel.app/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!verifyRes.ok) {
        throw new Error('Failed to verify user');
      }

      const userData = await verifyRes.json();

      // Role-based redirect
      if (role === 'admin') {
        // Verify admin access
        const adminRes = await fetch(`https://barber-appointment-backend.vercel.app/api/auth/verify-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!adminRes.ok) {
          throw new Error('Admin verification failed');
        }

        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'barber') {
        // Store barber-specific data
        const barberId = user.user_metadata?.barberId;
        localStorage.setItem('user-data', JSON.stringify({ 
          barberId, 
          email: user.email,
          name: user.user_metadata?.full_name
        }));
        localStorage.setItem('auth-token', token);
        
        navigate('/barber/dashboard', { replace: true });
      } else {
        // Regular user
        navigate('/user/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Callback error:', err);
      setError(err.message || 'Authentication failed');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md border border-gray-200">
          <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login in 3 seconds...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;