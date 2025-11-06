import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Calendar, Award, MapPin } from 'lucide-react';
import axios from 'axios';

const BarbersPage = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'https://barber-appointment-backend.vercel.app/api/barbers'
        );
        setBarbers(response.data);
      } catch (err) {
        setError('Failed to load barbers.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBarbers();
  }, []);

   /* Loading / Error UI */
   if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading barbers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex items-center justify-center">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

   /* Main Page */
   return (
    <div
      className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen"
      id="BarbersPage"
    >
      <section className="max-w-7xl mx-auto px-4 py-20">
        {/*  Header  */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="w-16 h-0.5 bg-[#D4AF37]"></div>
            <Scissors className="w-8 h-8 text-[#D4AF37]" />
            <div className="w-16 h-0.5 bg-[#D4AF37]"></div>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-black uppercase tracking-tight mb-6">
            Our Expert Barbers
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Meet our talented team dedicated to providing top-notch grooming services
          </p>
        </div>

        {/*  Barbers Grid  */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-12">
              No barbers available.
            </p>
          ) : (
            barbers.map((barber) => (
              <div
                key={barber._id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-[#D4AF37] flex flex-col"
              >
                {/* Name */}
                <h3 className="text-2xl font-black text-black mb-3">
                  {barber.name}
                </h3>

                {/* Experience */}
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-medium">
                    {barber.experienceYears} years experience
                  </span>
                </div>

                {/* Branch */}
                <div className="flex items-center gap-2 text-gray-700 mb-5">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">
                    {barber.branch?.name || 'Not Assigned'}
                    {barber.branch?.city && `, ${barber.branch.city}`}
                  </span>
                </div>

                {/* Specialties */}
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Specialties
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(barber.specialties) && barber.specialties.length > 0 ? (
                    barber.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-[#D4AF37]/10 text-gray-800 text-sm font-medium rounded-full border border-[#D4AF37]/30"
                      >
                        {spec}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No specialties listed
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/*  CTA  */}
        <div className="mt-20 text-center bg-gradient-to-r from-black via-gray-900 to-black p-12 rounded-3xl shadow-2xl">
          <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-tight">
            Book with Us
          </h2>
          <p className="text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Schedule an appointment with your preferred barber today
          </p>
          <Link to="/booking">
            <button className="bg-[#D4AF37] text-black font-bold px-10 py-4 rounded-full uppercase tracking-wider text-base hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 inline-flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              Book Appointment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BarbersPage;