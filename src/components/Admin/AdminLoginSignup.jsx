import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Initialize Google Sign-In
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError('');
    
    try {
      const googleToken = response.credential;

      // Send to backend
      const res = await fetch(`https://barber-appointment-backend.vercel.app/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Google authentication failed');
      }

      const data = await res.json();
      const { token, user, role } = data;

      // Store auth data
      localStorage.setItem('auth-token', token);
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-role', role);
      localStorage.setItem('user-id', user.id);

      console.log(' Google login successful:', { email: user.email, role });

      // Role-based redirect
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
      setError(err.message || 'Google authentication failed');
      console.error(' Google auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Sign-In not loaded yet. Please refresh.');
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
      
      const res = await fetch(`https://barber-appointment-backend.vercel.app${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await res.json();

      if (isLogin) {
        const { token, user, role } = data;

        // Store auth data
        localStorage.setItem('auth-token', token);
        localStorage.setItem('user-email', user.email);
        localStorage.setItem('user-role', role);
        localStorage.setItem('user-id', user.id);

        console.log(' Login successful:', { email: user.email, role });
        
        // Role-based redirect
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
      setError(err.message || 'Something went wrong');
      console.error(' Auth error:', err);
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
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isLogin ? 'Login with Google' : 'Signup with Google'}
            </button>
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