import React from "react";
import { Scissors, Award, Users, Clock, Sparkles, Star } from "lucide-react";
import { NavLink } from "react-router-dom";

const AboutPage = () => {
  const stats = [
    { number: "15+", label: "Years Experience", icon: Award },
    { number: "50K+", label: "Happy Clients", icon: Users },
    { number: "100%", label: "Satisfaction", icon: Star },
    { number: "24/7", label: "Support", icon: Clock },
  ];

  const values = [
    { icon: Scissors, title: "Master Craftsmanship", description: "Every cut is executed with precision and artistic flair by our expert barbers" },
    { icon: Sparkles, title: "Premium Experience", description: "Luxury service in an elegant atmosphere designed for your comfort" },
    { icon: Award, title: "Excellence Standard", description: "We maintain the highest standards in grooming and customer service" },
  ];

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-20 lg:py-28 mb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200)',
            filter: 'brightness(0.4)'
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="w-10 sm:w-14 h-0.5 bg-[#D4AF37]"></div>
              <Scissors className="w-5 h-5 sm:w-7 sm:h-7 text-[#D4AF37]" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-3 sm:mb-4 uppercase tracking-tight leading-tight">
              Welcome to<br />
              <span className="text-[#D4AF37]">Berger</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 font-light">
              An amazing barbershop located in the heart of the Upper West Side Manhattan
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 sm:-mt-10 lg:-mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div 
                key={i} 
                className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 text-center shadow-lg border border-gray-100 hover:border-[#D4AF37] transition-all hover:scale-105"
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-black text-black mb-1">{stat.number}</div>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 sm:w-10 h-0.5 bg-[#D4AF37]"></div>
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black mb-4 sm:mb-5 uppercase tracking-tight">
              Our Story
            </h2>
            <div className="space-y-3 sm:space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed">
              <p>Founded with passion and precision, our barbershop began as a small dream to redefine men's grooming.</p>
              <p>Every cut, every shave, and every style we create reflects our dedication to detail and individuality.</p>
              <p>At the heart of our story is one simple goal — to make every client look sharp and feel their best.</p>
            </div>
            <NavLink 
              to="/booking" 
              className="mt-5 sm:mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full uppercase tracking-wider text-xs sm:text-sm hover:from-black hover:to-gray-900 hover:text-white transition-all shadow-md hover:shadow-lg"
            >
              <Scissors className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
              Book Appointment
            </NavLink>
          </div>
          
          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <div className="h-40 sm:h-48 rounded-lg sm:rounded-xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400" 
                  alt="Barbershop interior" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                />
              </div>
              <div className="h-32 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400" 
                  alt="Barber tools" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                />
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
              <div className="h-32 sm:h-36 rounded-lg sm:rounded-xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400" 
                  alt="Grooming products" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                />
              </div>
              <div className="h-40 sm:h-48 rounded-lg sm:rounded-xl overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400" 
                  alt="Barber at work" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-black py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 sm:w-10 h-0.5 bg-[#D4AF37]"></div>
            <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-[#D4AF37]" />
            <div className="w-8 sm:w-10 h-0.5 bg-[#D4AF37]"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 uppercase tracking-tight">
            What Sets Us Apart
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm lg:text-base max-w-xl mx-auto mb-8 sm:mb-10">
            Excellence in every detail, luxury in every experience
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div 
                  key={i} 
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg sm:rounded-xl p-5 sm:p-6 border border-gray-700 hover:border-[#D4AF37] transition-all hover:scale-105"
                >
                  <div className="bg-[#D4AF37] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-3 sm:mb-4 mx-auto sm:mx-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 uppercase tracking-tight">
                    {v.title}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-gradient-to-r from-black to-gray-900 rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center shadow-xl border border-[#D4AF37]">
          <Scissors className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] mx-auto mb-3 sm:mb-4" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3 uppercase tracking-tight">
            Ready for the Ultimate Grooming Experience?
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm lg:text-base mb-5 sm:mb-6 max-w-xl mx-auto">
            Book your appointment today and discover why Berger is Manhattan's premier destination
          </p>
          <NavLink 
            to="/booking" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black font-bold px-8 sm:px-10 py-3 sm:py-3.5 rounded-full uppercase tracking-wider text-xs sm:text-sm hover:from-white hover:to-gray-100 transition-all shadow-md hover:shadow-lg"
          >
            Book Now 
            <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
          </NavLink>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;