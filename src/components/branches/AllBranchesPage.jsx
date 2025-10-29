import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, Search, ChevronRight, Building2, Scissors } from 'lucide-react';
import axios from 'axios';

const AllBranchesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  // Fetch data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/data/branches.json');
        setBranches(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load branches. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen">
      {/* Hero Header Section */}
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
            Find your nearest premium barber shop and experience excellence
          </p>
        </div>

        {/* Search Bar */}
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

      {/* Branches Grid Section */}
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
            <p className="text-gray-600 font-medium text-lg">No branches found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBranches.map((branch) => (
              <div
                key={branch._id}
                onMouseEnter={() => setHoveredId(branch._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D4AF37] overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={branch.image} 
                    alt={branch.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  
                  {/* City Badge */}
                  <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    {branch.city}
                  </div>
                  
                  {/* Branch Name Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight">
                      {branch.name}
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-800 font-medium leading-relaxed">
                        {branch.address}
                      </p>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <p className="text-sm text-gray-800 font-medium">{branch.openingHours}</p>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <a 
                        href={`tel:${branch.phone}`}
                        className="text-sm text-gray-800 font-medium hover:text-[#D4AF37] transition-colors"
                      >
                        {branch.phone}
                      </a>
                    </div>
                  </div>

                  {/* Action Buttons */}
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
