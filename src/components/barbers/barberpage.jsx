import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Award, Star, MapPin, Calendar } from 'lucide-react';

const barbers = [
  { 
    _id: "1", 
    name: "James Cole", 
    experience_years: 8, 
    specialties: ["Haircuts", "Styling"], 
    branch: "1",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop"
  },
  { 
    _id: "2", 
    name: "Ryan Smith", 
    experience_years: 5, 
    specialties: ["Beard Trim", "Shave"], 
    branch: "1",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  },
  { 
    _id: "3", 
    name: "Omar Ali", 
    experience_years: 6, 
    specialties: ["Hair Color", "Grooming"], 
    branch: "1",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
  },
  { 
    _id: "4", 
    name: "Michael Brown", 
    experience_years: 4, 
    specialties: ["Haircuts", "Styling"], 
    branch: "2",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop"
  },
  { 
    _id: "5", 
    name: "Liam Johnson", 
    experience_years: 4, 
    specialties: ["Beard Trim", "Shave"], 
    branch: "2",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
  },
  { 
    _id: "6", 
    name: "Noor Patel", 
    experience_years: 5, 
    specialties: ["Hair Color", "Grooming"], 
    branch: "2",
    image: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&h=400&fit=crop"
  },
  { 
    _id: "7", 
    name: "Ethan White", 
    experience_years: 6, 
    specialties: ["Haircuts", "Styling"], 
    branch: "3",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop"
  },
  { 
    _id: "8", 
    name: "Aiden Clarke", 
    experience_years: 3, 
    specialties: ["Beard Trim", "Shave"], 
    branch: "3",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop"
  },
  { 
    _id: "9", 
    name: "Zara Khan", 
    experience_years: 5, 
    specialties: ["Hair Color", "Grooming"], 
    branch: "3",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
  },
  { 
    _id: "10", 
    name: "Oliver Green", 
    experience_years: 5, 
    specialties: ["Haircuts", "Styling"], 
    branch: "4",
    image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=400&h=400&fit=crop"
  },
  { 
    _id: "11", 
    name: "Luke Martin", 
    experience_years: 4, 
    specialties: ["Beard Trim", "Shave"], 
    branch: "4",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop"
  },
  { 
    _id: "12", 
    name: "Priya Singh", 
    experience_years: 6, 
    specialties: ["Hair Color", "Grooming"], 
    branch: "4",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
  },
  { 
    _id: "13", 
    name: "Callum Ross", 
    experience_years: 7, 
    specialties: ["Haircuts", "Styling"], 
    branch: "5",
    image: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=400&h=400&fit=crop"
  },
  { 
    _id: "14", 
    name: "Sean MacLeod", 
    experience_years: 5, 
    specialties: ["Beard Trim", "Shave"], 
    branch: "5",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop"
  },
  { 
    _id: "15", 
    name: "Hamza Ahmed", 
    experience_years: 4, 
    specialties: ["Hair Color", "Grooming"], 
    branch: "5",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop"
  },
];

const BarbersPage = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen" id="BarbersPage">
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
            Our Expert Barbers
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
            Meet our talented team dedicated to providing top-notch grooming services
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((barber) => (
            <div
              key={barber._id}
              onMouseEnter={() => setHoveredId(barber._id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 hover:border-[#D4AF37] overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={barber.image} 
                  alt={barber.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Experience Badge */}
                <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                  <Award className="w-4 h-4" />
                  {barber.experience_years} Years
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#D4AF37] transition-colors duration-300">
                  {barber.name}
                </h3>

                {/* Branch */}
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-sm font-medium">Branch {barber.branch}</span>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-semibold">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map((specialty, idx) => (
                      <span 
                        key={idx} 
                        className="text-xs bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 text-gray-800 px-3 py-1.5 rounded-full font-medium border border-[#D4AF37]/20"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(5.0)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
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