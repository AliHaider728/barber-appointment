import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const googleButtonRef = useRef(null); // Ref for rendering Google button

  const API_URL = import.meta.env.VITE_API_URL || 'https://barber-appointment-backend.vercel.app';

  // Initialize Google Sign-In
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        // Render the Google button
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline', // or 'filled_blue', etc.
            size: 'large',
            text: isLogin ? 'signin_with' : 'signup_with', // Adjust based on mode
            shape: 'rectangular',
            width: '100%', // Match your button width
          });
        }

        // Optional: Prompt if you want One Tap auto-show (but can be suppressed)
        // window.google.accounts.id.prompt(); // Comment out if not needed
        console.log('Google GIS initialized successfully');
      } else {
        console.error('Google script loaded but window.google not available');
        setError('Google Sign-In failed to load. Refresh the page.');
      }
    };

    script.onerror = () => {
      console.error('Failed to load Google GIS script');
      setError('Failed to load Google Sign-In. Check your network.');
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [isLogin]); // Re-render button if login/signup toggles

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError('');
    
    try {
      const googleToken = response.credential;

      const res = await fetch(`${API_URL}/api/auth/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        const errorData = contentType?.includes('application/json') ? await res.json() : { message: 'Server error' };
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      const { token, user, role } = data;

      localStorage.setItem('auth-token', token);
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-role', role);
      localStorage.setItem('user-id', user.id);

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'barber') {
        localStorage.setItem('user-data', JSON.stringify({ 
          barberId: user.barberId, 
          email: user.email,
          name: user.fullName
        }));
        navigate('/barber/dashboard', { replace: true });
      } else {
        navigate('/user/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Google authentication failed. Please try again.');
      console.error('Google auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const contentType = res.headers.get('content-type');
        const errorData = contentType?.includes('application/json') ? await res.json() : { message: 'Server error' };
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (isLogin) {
        const { token, user, role } = data;

        localStorage.setItem('auth-token', token);
        localStorage.setItem('user-email', user.email);
        localStorage.setItem('user-role', role);
        localStorage.setItem('user-id', user.id);

        if (role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (role === 'barber') {
          localStorage.setItem('user-data', JSON.stringify({ 
            barberId: user.barberId, 
            email: user.email,
            name: user.fullName
          }));
          navigate('/barber/dashboard', { replace: true });
        } else {
          navigate('/user/dashboard', { replace: true });
        }
      } else {
        alert('Account created! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap');
          
          .shiny-text {
            position: relative;
            display: inline-block;
            font-family: "Josefin Sans", sans-serif;
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
              {isLogin ? 'Login' : 'Signup'}
            </h2>
            <p className="text-center text-gray-500 text-sm">
              {isLogin ? 'Enter your credentials to continue' : 'Create your account'}
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
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37] focus:ring-opacity-20 outline-none transition-all duration-200"
                  required
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#D4AF37] text-black font-bold py-3.5 rounded-lg hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Signup')}
            </button>
          </form>

          {/* Google Auth */}
          <div className="mt-4">
            <div ref={googleButtonRef} className="w-full" /> {/* Google button renders here */}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { 
                  setIsLogin(!isLogin); 
                  setError(''); 
                  setEmail(''); 
                  setPassword(''); 
                  setConfirmPassword('');
                }}
                className="text-[#D4AF37] font-bold hover:underline transition-colors"
                disabled={loading}
              >
                {isLogin ? 'Signup' : 'Login'}
              </button>
            </p>
          </div>

          <div className="flex justify-center mt-8">
            <span className="shiny-text text-gray-700 text-sm font-medium">
              Powered By TecnoSphere
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginSignup;