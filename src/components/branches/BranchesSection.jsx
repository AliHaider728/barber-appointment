import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, ChevronRight, Building2, Scissors } from 'lucide-react';
import axios from 'axios';

// API URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://barber-appointment-backend.vercel.app';

const BranchesSection = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/branches`);
        setBranches(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load branches.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Smart image URL resolver - same as admin panel
  const getImageSrc = (image) => {
    if (!image) return 'https://via.placeholder.com/400x300?text=No+Image';
    // If it's already a Base64 string
    if (image.startsWith('data:')) return image;
    // If it's a full URL
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    // If it's a relative path from old system
    return `${API_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  };

  // Loading Skeleton Component
  const BranchSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-300"></div>
      <div className="p-6">
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
        <div className="h-12 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <section className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2]">
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <div className="inline-block mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
            <div className="w-8 sm:w-12 h-0.5 bg-[#D4AF37]"></div>
            <Building2 className="w-6 sm:w-8 h-6 sm:h-8 text-[#D4AF37]" />
            <div className="w-8 sm:w-12 h-0.5 bg-[#D4AF37]"></div>
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-black mb-4 sm:mb-6 uppercase tracking-tight px-4">
          Our Branches
        </h2>
        <p className="text-gray-700 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-4">
          Visit us at any of our premium locations across the UK
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <BranchSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-base sm:text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {branches.slice(0, 4).map((branch) => (
              <div
                key={branch._id}
                onMouseEnter={() => setHoveredId(branch._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D4AF37] overflow-hidden"
              >
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  <img
                    src={getImageSrc(branch.image)}
                    alt={branch.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[#D4AF37] text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg">
                    {branch.city}
                  </div>

                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {branch.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm text-gray-800 font-medium">{branch.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-[#D4AF37] flex-shrink-0" />
                      <p className="text-xs sm:text-sm text-gray-800 font-medium">{branch.openingHours}</p>
                    </div>
                  </div>

                  <Link to={`/branches/${branch._id}`}>
                    <button className="w-full bg-gradient-to-r from-gray-100 to-gray-50 hover:from-[#D4AF37] hover:to-[#F4D03F] text-gray-800 hover:text-black font-bold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg text-sm sm:text-base">
                      View Details
                      <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && !error && (
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
          <Link to="/branches">
            <button className="bg-[#D4AF37] text-black font-bold px-6 sm:px-8 lg:px-10 py-3 sm:py-4 rounded-full uppercase tracking-wider text-sm sm:text-base hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-2 sm:gap-3">
              <Scissors className="w-4 sm:w-5 h-4 sm:h-5" />
              View All Branches
            </button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default BranchesSection;