import { useState, useEffect } from 'react';
import { Menu, X, Scissors, User, LogOut, LayoutDashboard, User2Icon } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on login page
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const role = localStorage.getItem('user-role');
    const email = localStorage.getItem('user-email');
    
    setIsLoggedIn(!!token);
    setUserRole(role);
    setUserEmail(email || '');

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-data');
    
    setIsLoggedIn(false);
    setUserRole(null);
    setUserEmail('');
    setShowDropdown(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'branch_admin') return '/branch-admin/dashboard';
    if (userRole === 'barber') return '/barber/dashboard';
    return '/user/dashboard';
  };

  const desktopNavItems = [
    { name: 'Home', href: '/' },
    { name: 'Branches', href: '/branches' },
    { name: 'About', href: '/About' },
  ];

  const mobileOnlyNavItems = [
    { name: 'Our Barbers', href: '/barbers' },
    { name: 'Services', href: '/services/all' },
  ];

  const allMobileNavItems = [...desktopNavItems, ...mobileOnlyNavItems];

  return (
    <>
      <header
        className={`${isLoginPage ? 'relative' : 'fixed'} top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isLoginPage 
            ? 'bg-black'
            : scrolled
            ? 'bg-black/95 backdrop-blur-lg shadow-lg shadow-[#D4AF37]/10'
            : 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-9 h-24 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center group">
            <div className="relative">
              <img
                src="https://berger.themerex.net/wp-content/uploads/2016/07/logo.png"
                alt="Logo"
                className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/5 rounded-lg transition-all duration-300"></div>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {desktopNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `relative px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-300 group ${
                    isActive ? 'text-[#D4AF37]' : 'text-white hover:text-[#D4AF37]'
                  }`
                }
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] group-hover:w-full transition-all duration-300"></span>
              </NavLink>
            ))}

            {/* Book Now & Auth Buttons */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
              {/* Book Now */}
              <NavLink to="/booking">
                <button className="group relative px-6 py-3 border-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] border-white/10 text-black font-bold rounded-full overflow-hidden transition-all duration-500 uppercase tracking-wider text-sm">
                  <span className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    Book Now
                  </span>
                </button>
              </NavLink>

              {/* User Icon with Dropdown OR Admin Button */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="group relative w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full flex items-center justify-center overflow-hidden transition-all duration-300 hover:scale-110"
                  >
                    <User className="w-6 h-6 text-black" />
                  </button>


                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-lg rounded-xl shadow-2xl border border-[#D4AF37]/20 overflow-hidden z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-[#D4AF37]/20">
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm text-white font-semibold truncate mt-1">{userEmail}</p>
                        {userRole && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full uppercase">
                            {userRole}
                          </span>
                        )}
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate(getDashboardLink());
                            setShowDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-white hover:bg-[#D4AF37]/10 transition-colors duration-200 flex items-center gap-3"
                        >
                          <User2Icon className="w-4 h-4 text-[#D4AF37]" />
                          <span className="text-sm font-medium">Profile</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition-colors duration-200 flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/login">
                  <button className="group relative px-6 py-3 bg-transparent text-white font-bold rounded-full overflow-hidden transition-all duration-500 uppercase tracking-wider text-sm border border-white/20">
                    <span className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                      Login
                    </span>
                  </button>
                </NavLink>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative w-12 h-12 flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors duration-300 group"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/10 rounded-xl transition-all duration-300"></div>
            {isOpen ? <X size={28} className="relative z-10" /> : <Menu size={28} className="relative z-10" />}
          </button>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/90 backdrop-blur-md z-40 transition-all duration-500 lg:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Side Navigation */}
      <nav
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 bg-gradient-to-b from-black via-gray-900 to-black z-50 transform transition-all duration-500 ease-out shadow-2xl lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      > 
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#F4D03F]/10 rounded-full blur-3xl"></div>

          {/* Mobile Header */}
          <div className="relative flex justify-between items-center p-6 border-b border-[#D4AF37]/20">
            <div className="flex items-center gap-3">
              <Scissors className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-black tracking-widest uppercase">Menu</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-xl transition-all duration-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Info (Mobile) */}
          {isLoggedIn && (
            <div className="relative px-6 py-4 bg-black/30 border-b border-[#D4AF37]/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm truncate">{userEmail}</p>
                  {userRole && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full uppercase">
                      {userRole}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Navigation Links */}
          <div className="relative flex-1 px-6 py-8 overflow-y-auto">
            <ul className="space-y-2">
              {allMobileNavItems.map((item, index) => (
                <li
                  key={item.name}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`${isOpen ? 'animate-fadeIn' : ''}`}
                >
                  <NavLink
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group block relative py-3.5 px-6 text-base font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-[#D4AF37] group-hover:w-8 transition-all duration-300"></div>
                    <span className="relative z-10 pl-10 group-hover:translate-x-1 transition-transform duration-300">
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}

              {/* Dashboard Link (Mobile) */}
              {isLoggedIn && (
                <li className={`${isOpen ? 'animate-fadeIn' : ''}`}>
                  <button
                    onClick={() => {
                      navigate(getDashboardLink());
                      setIsOpen(false);
                    }}
                    className="group w-full text-left relative py-3.5 px-6 text-base font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-[#D4AF37] group-hover:w-8 transition-all duration-300"></div>
                    <span className="relative z-10 pl-10 group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Bottom CTAs */}
          <div className="relative px-6 py-8 border-t border-[#D4AF37]/20 bg-black/50 backdrop-blur-sm space-y-4">
            <NavLink to="/booking" onClick={() => setIsOpen(false)}>
              <button className="group mb-3 border-2 border-white/10 relative w-full py-4 px-6 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-black rounded-2xl overflow-hidden transition-all duration-500 uppercase tracking-wider flex items-center justify-center gap-2">
                <span className="absolute inset-0 translate-y-full bg-black group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                <Scissors className="w-5 h-5 relative z-10 transition-colors duration-300 group-hover:text-white" />
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                  Book Now
                </span>
              </button>
            </NavLink>

            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="group relative w-full py-4 px-6 bg-transparent text-red-400 font-black rounded-2xl overflow-hidden transition-all duration-500 uppercase tracking-wider border-2 border-red-400/20 flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 bg-red-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                <LogOut className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Logout</span>
              </button>
            ) : (
              <NavLink to="/login" onClick={() => setIsOpen(false)}>
                <button className="group relative w-full py-4 px-6 bg-transparent text-white font-black rounded-2xl overflow-hidden transition-all duration-500 uppercase tracking-wider border-2 border-white/10">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></span>
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                    Login
                  </span>
                </button>
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}