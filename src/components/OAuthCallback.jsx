import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js';

const OAuthCallback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // CRITICAL: Handle the hash fragment from OAuth redirect
      // Supabase stores tokens in URL hash, not query params
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');

      if (!access_token) {
        throw new Error('No access token found in callback URL');
      }

      // Set the session using the tokens from URL
      const { data: { session }, error: sessionError } = await supabase.auth.setSession({
        access_token,
        refresh_token
      });
      
      if (sessionError) throw sessionError;
      if (!session) throw new Error('Failed to create session');

      const user = session.user;
      const token = session.access_token;
      const role = user.user_metadata?.role || 'user';

      console.log('User authenticated:', { email: user.email, role });

      // Store auth data
      localStorage.setItem('sb-token', token);
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-role', role);
      localStorage.setItem('user-id', user.id);

      // Call backend to verify user and get/create records
      const verifyRes = await fetch(`https://barber-appointment-backend.vercel.app/api/auth/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.message || 'Failed to verify user');
      }

      const userData = await verifyRes.json();
      console.log('Backend verification successful:', userData);

      // Role-based redirect
      if (role === 'admin') {
        const adminRes = await fetch(`https://barber-appointment-backend.vercel.app/api/auth/verify-admin`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!adminRes.ok) {
          throw new Error('Admin verification failed');
        }

        console.log('Redirecting to admin dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'barber') {
        const barberId = user.user_metadata?.barberId;
        
        if (!barberId) {
          throw new Error('Barber ID not found in user metadata');
        }

        localStorage.setItem('user-data', JSON.stringify({ 
          barberId, 
          email: user.email,
          name: user.user_metadata?.full_name
        }));
        localStorage.setItem('auth-token', token);
        
        console.log('Redirecting to barber dashboard');
        navigate('/barber/dashboard', { replace: true });
      } else {
        // Regular user
        console.log('Redirecting to user dashboard');
        navigate('/user/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Callback error:', err);
      setError(err.message || 'Authentication failed');
      setLoading(false);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    }
  };

  if (loading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">Authenticating...</p>
          <p className="mt-2 text-gray-500 text-sm">Please wait while we sign you in</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login in 3 seconds...</p>
          <button 
            onClick={() => navigate('/login', { replace: true })}
            className="mt-4 px-6 py-2 bg-[#D4AF37] text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-300"
          >
            Go to Login Now
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;