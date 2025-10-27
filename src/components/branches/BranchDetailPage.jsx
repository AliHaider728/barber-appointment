import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Phone, ChevronRight, Star, Award, Calendar, ArrowLeft, Scissors } from 'lucide-react';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import axios from 'axios';

const BranchDetailPage = () => {
  const { branchId } = useParams();
  const [branch, setBranch] = useState(null);
  const [branchBarbers, setBranchBarbers] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredBarber, setHoveredBarber] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);

  // Fetch data from JSON files
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [branchesResponse, barbersResponse, servicesResponse] = await Promise.all([
          axios.get('/data/branches.json'),
          axios.get('/data/barbers.json'),
          axios.get('/data/services.json'),
        ]);

        const branchesData = branchesResponse.data;
        const barbersData = barbersResponse.data;
        const servicesData = servicesResponse.data;

        const foundBranch = branchesData.find(b => b._id === branchId);
        setBranch(foundBranch);
        setBranchBarbers(barbersData.filter(b => b.branch === branchId));
        setAllServices(servicesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, [branchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-black text-black mb-4">Branch Not Found</h2>
          <Link to="/branches">
            <Button className="bg-[#D4AF37] text-black font-bold hover:bg-black hover:text-white">
              Back to Branches
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen">
      {/* Hero Section with Branch Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={branch.image || "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&h=600&fit=crop"} 
          alt={branch.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        {/* Back Button */}
        <Link to="/branches" className="absolute top-8 left-8 z-10">
          <button className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-black font-bold px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg">
            <ArrowLeft className="w-5 h-5" />
            Back to Branches
          </button>
        </Link>

        {/* Branch Title */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="inline-block bg-[#D4AF37] text-black px-4 py-2 rounded-full font-bold text-sm mb-4">
              {branch.city}
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-white uppercase tracking-tight mb-2">
              {branch.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        
        {/* Branch Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-20 relative z-10">
          {/* Address Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="bg-[#D4AF37]/10 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Address</p>
                <p className="text-base font-semibold text-black">{branch.address}</p>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="bg-[#D4AF37]/10 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Opening Hours</p>
                <p className="text-base font-semibold text-black">{branch.openingHours}</p>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-100 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex items-start gap-4">
              <div className="bg-[#D4AF37]/10 p-3 rounded-xl">
                <Phone className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-base font-semibold text-black">{branch.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Barbers Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
                <Scissors className="w-8 h-8 text-[#D4AF37]" />
                <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-tight mb-4">
              Our Expert Barbers
            </h2>
            <p className="text-gray-600 text-lg">Meet our talented team of professionals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {branchBarbers.map((barber) => (
              <div
                key={barber._id}
                onMouseEnter={() => setHoveredBarber(barber._id)}
                onMouseLeave={() => setHoveredBarber(null)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D4AF37] overflow-hidden transform hover:-translate-y-2"
              >
                {/* Barber Image */}
                <div className="relative h-64 overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Award className="w-20 h-20 text-gray-300" />
                  </div>
                  {hoveredBarber === barber._id && (
                    <div className="absolute inset-0 bg-[#D4AF37]/90 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-black" />
                    </div>
                  )}
                </div>

                {/* Barber Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">
                    {barber.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                    <p className="text-sm font-bold text-gray-600">
                      {barber.experience_years} Years Experience
                    </p>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map((specialty, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs font-bold bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 px-3 py-1.5 rounded-full border border-gray-200"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
                <Star className="w-8 h-8 text-[#D4AF37]" />
                <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
              </div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-black uppercase tracking-tight mb-4">
              Services Available
            </h2>
            <p className="text-gray-600 text-lg">Premium grooming services tailored for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service, index) => (
              <div
                key={index}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#D4AF37] p-6 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-black text-black uppercase tracking-tight">
                    {service.name}
                  </h3>
                  {hoveredService === index && (
                    <ChevronRight className="w-6 h-6 text-[#D4AF37] animate-pulse" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-600">{service.duration}</p>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
                  <p className="text-3xl font-black text-[#D4AF37]">{service.price}</p>
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-[#D4AF37] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#D4AF37] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="inline-block mb-6">
              <Calendar className="w-16 h-16 text-[#D4AF37]" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-4">
              Ready to Book?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Schedule your appointment with one of our expert barbers today and experience premium grooming!
            </p>
            <Link to={`/booking?branch=${branch._id}`}>
              <Button className="bg-[#D4AF37] text-black font-bold px-10 py-4 rounded-full uppercase tracking-wider text-base hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3">
                <Calendar className="w-5 h-5" />
                Book Appointment Now
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BranchDetailPage;