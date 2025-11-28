import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient.js'

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash.substring(1); // Get hash params
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const expiresIn = params.get('expires_in');

      if (accessToken) {
        // Set session manually
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn,
        });

        // Get user and redirect based on role
        const { data: { user } } = await supabase.auth.getUser();
        const role = user?.user_metadata?.role || 'user';

        localStorage.setItem('sb-token', accessToken);

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'barber') {
          navigate('/barber/dashboard');
        } else {
          navigate('/');
        }
      } else {
        console.error('No access token in callback');
        navigate('/login'); // Redirect on error
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Loading...</div>; // Spinner or loading UI
};

export default OAuthCallback;