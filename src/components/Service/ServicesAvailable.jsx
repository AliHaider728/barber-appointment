import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Clock, Sparkles, Baby, HandMetal, Droplets, Wind, Palette, User } from 'lucide-react';
import axios from 'axios';

const ServicesAvailable = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/data/services.json');
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Map Icon components to service names
  const iconMap = {
    "Men's Haircut": Scissors,
    "Beard Trim": Wind,
    "Hair Color": Palette,
    "Facial & Grooming": Sparkles,
    "Kids Haircut": Baby,
    "Head Massage": HandMetal,
    "Hair Wash": Droplets,
    "Shave": Wind,
    "Hair Styling": User,
    "Waxing": Sparkles,
  };

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen" id="ServicesAvailable">
      <section className="max-w-7xl mx-auto px-4 py-20">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
              <Scissors className="w-8 h-8 text-[#D4AF37]" />
              <div className="w-12 h-0.5 bg-[#D4AF37]"></div>
            </div>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-black mb-6 uppercase tracking-tight">
            Our Services
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Premium grooming experiences tailored to your style
          </p>
        </div>
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 col-span-full">
              <p className="text-red-600">{error}</p>
            </div>
          ) : services.map((service, index) => {
            const ServiceIcon = iconMap[service.name] || Scissors; // Fallback to Scissors if icon not found
            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D4AF37] relative overflow-hidden"
              >
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-5 inline-block p-4 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <ServiceIcon className="w-8 h-8 text-[#D4AF37]" strokeWidth={2} />
                  </div>
                  
                  {/* Service Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {service.name}
                  </h3>
                  
                  {/* Duration */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-base">{service.duration}</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-3xl font-black text-[#D4AF37]">{service.price}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Section */}
        <div className="mt-20 text-center bg-gradient-to-r from-black via-gray-900 to-black p-12 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">
            Ready to Book?
          </h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Schedule your appointment with one of our expert barbers today
          </p>
          <Link to="/booking">
            <button className="bg-[#D4AF37] text-black font-bold px-10 py-4 rounded-full uppercase tracking-wider text-base hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3">
              <Scissors className="w-5 h-5" />
              Book Appointment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesAvailable;