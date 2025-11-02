import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Search, ChevronRight, Building2, Scissors } from 'lucide-react';
import axios from 'axios';

// API URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://barber-appointment-backend.vercel.app';

const AllBranchesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Smart image URL resolver - handles Base64, full URLs, and relative paths
  const getImageSrc = (image) => {
    if (!image) return 'https://via.placeholder.com/600x400?text=No+Image';
    // If it's already a Base64 string
    if (image.startsWith('data:')) return image;
    // If it's a full URL
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    // If it's a relative path from old system
    return `${API_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/branches`);
        setBranches(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load branches.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBranches = branches.filter(branch =>
    branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
              <Building2 className="w-8 h-8 text-[#D4AF37]" />
              <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
            </div>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-black mb-6 uppercase tracking-tight">
            All Branches
          </h1>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Find your nearest premium barber shop
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#D4AF37]" />
            <input
              type="text"
              placeholder="Search by city, name, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-gray-200 focus:border-[#D4AF37] focus:outline-none text-gray-800 placeholder-gray-500 text-lg shadow-lg transition-all duration-300"
            />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#D4AF37]"></div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Loading branches...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg max-w-md mx-auto p-8">
            <p className="text-red-600 font-medium text-lg">{error}</p>
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg max-w-md mx-auto p-8">
            <Scissors className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg">No branches found.</p>
            {searchTerm && (
              <p className="text-gray-500 text-sm mt-2">Try adjusting your search term</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBranches.map((branch) => (
              <div
                key={branch._id}
                onMouseEnter={() => setHoveredId(branch._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D4AF37] overflow-hidden transform hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getImageSrc(branch.image)}
                    alt={branch.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Branch+Image'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {branch.city}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                      {branch.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-800 font-medium leading-relaxed">{branch.address}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <p className="text-sm text-gray-800 font-medium">{branch.openingHours}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <a href={`tel:${branch.phone}`} className="text-sm text-gray-800 font-medium hover:text-[#D4AF37] transition-colors">
                        {branch.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link to={`/branches/${branch._id}`} className="flex-1">
                      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm">
                        View Details
                      </button>
                    </Link>
                    <Link to={`/booking?branch=${branch._id}`} className="flex-1">
                      <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] hover:from-black hover:to-gray-900 text-black hover:text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm">
                        Book Now
                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AllBranchesPage;