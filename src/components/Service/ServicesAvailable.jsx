import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import axios from 'axios';

const ServicesAvailable = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        console.error('Services fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen py-20" id="ServicesAvailable">
      <section className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-0.5 bg-[#D4AF37]"></div>
            <div className="w-10 h-10 bg-[#D4AF37] rounded-full"></div>
            <div className="w-16 h-0.5 bg-[#D4AF37]"></div>
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
            <div className="col-span-full flex flex-col items-center py-20">
              <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
              <p className="text-gray-600 text-lg">Loading premium services...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-20">
              <p className="text-red-600 text-lg font-medium">{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-gray-500 text-lg">No services available at the moment.</p>
            </div>
          ) : (
            services.map((service, index) => (
              <div
                key={service._id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D4AF37] relative overflow-hidden cursor-pointer"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 via-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-bl-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative z-10">
                  {/* Service Name */}
                  <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-[#D4AF37] transition-colors duration-300">
                    {service.name}
                  </h3>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-base font-medium">{service.duration}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-5">
                    <span className="text-3xl font-black text-[#D4AF37]">{service.price}</span>
                  </div>
                </div>

                {/* Hover Pulse */}
                {hoveredIndex === index && (
                  <div className="absolute inset-0 border-2 border-[#D4AF37] rounded-2xl animate-pulse"></div>
                )}
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-black via-gray-900 to-black p-12 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 uppercase tracking-tight">
              Ready to Book?
            </h2>
            <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
              Schedule your appointment with one of our expert barbers today
            </p>
            <Link to="/booking">
              <button className="bg-[#D4AF37] text-black font-bold px-10 py-4 rounded-full uppercase tracking-wider text-base hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3">
                Book Appointment
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesAvailable;