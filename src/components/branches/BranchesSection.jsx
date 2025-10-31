import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, ChevronRight, Building2, Scissors } from 'lucide-react';
import axios from 'axios';

const BranchesSection = () => {
  const [hoveredId, setHoveredId] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://barber-appointment-backend.vercel.app/api/branches');
        setBranches(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load branches.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath)
    return "https://via.placeholder.com/400x300?text=No+Image";

  // Automatically select backend URL based on environment
  const baseURL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : "https://barber-appointment-backend.vercel.app";

  // Return the correct image URL
  return imagePath.startsWith("http")
    ? imagePath
    : `${baseURL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

  return (
    <section className="max-w-full mx-auto px-4 py-20 bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2]">
      <div className="text-center mb-16">
        <div className="inline-block mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
            <Building2 className="w-8 h-8 text-[#D4AF37]" />
            <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
          </div>
        </div>
        <h2 className="text-5xl lg:text-7xl font-black text-black mb-6 uppercase tracking-tight">
          Our Branches
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
          Visit us at any of our premium locations across the UK
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-600">Loading branches...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-red-600">{error}</p>
            </div>
          ) : branches.slice(0, 4).map((branch) => (
            <div
              key={branch._id}
              onMouseEnter={() => setHoveredId(branch._id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D4AF37] overflow-hidden"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={getImageUrl(branch.image)}
                  alt={branch.name}
                  className="w-full h-full object-cover"
                 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  {branch.city}
                </div>

                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    {branch.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-800 font-medium">{branch.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    <p className="text-sm text-gray-800 font-medium">{branch.openingHours}</p>
                  </div>
                </div>

                <Link to={`/branches/${branch._id}`}>
                  <button className="w-full bg-gradient-to-r from-gray-100 to-gray-50 hover:from-[#D4AF37] hover:to-[#F4D03F] text-gray-800 hover:text-black font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg">
                    View Details
                    <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link to="/branches">
          <button className="bg-[#D4AF37] text-black font-bold px-10 py-4 rounded-full uppercase tracking-wider text-base hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3">
            <Scissors className="w-5 h-5" />
            View All Branches
          </button>
        </Link>
      </div>
    </section>
  );
};

export default BranchesSection;