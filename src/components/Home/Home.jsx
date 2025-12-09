import React from "react";
import { NavLink } from "react-router-dom";
import SidebarEngles from "../SidebarEngles";
import TestimonialSliderHome from "../TestimonialSliderHome";
import OurStaff from "../Staffs/OurStaff";
import PriceList from "../PriceList";
import LocationMap from "../LocationMap";
import Services from "../Service/Services";
import BranchesSection from "../branches/BranchesSection";

function Home() {
  return (
    <>
      <SidebarEngles />

      {/* Hero Banner Section */}
      <div className="relative min-h-screen flex flex-col" id="banner">
        {/* Background Image with Fixed Attachment */}
        <div
          className="fixed top-0 left-0 w-full h-full -z-10"
          style={{
            backgroundImage: 'url("/banner_home.jpg")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundAttachment: "fixed",
          }}
        />

        {/* Overlay for better text readability */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 bg-black/40"></div>

        {/* Hero Content - Takes full space */}
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 py-24 sm:py-32 md:py-32 mb-16">
          <img
            src="/logo_home.png"
            alt="Logo"
            className="mb-6 sm:mb-8 md:mb-1 w-40 sm:w-48 md:w-56 lg:w-64 max-w-full drop-shadow-2xl animate-fadeIn"
          />

          <div className="space-y-6 sm:space-y-8 animate-fadeInUp">
            <h4 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto drop-shadow-2xl px-4 leading-relaxed font-medium">
              Premium Barbershop is the prime spot for your hair grooming needs in your city
            </h4>
            <div>

              <NavLink to="/booking">
                <button className="group relative px-8 py-5 bg-transparent text-[#d5a353] text-md uppercase font-bold tracking-wider overflow-hidden transition-all duration-700 hover:text-black">
                  {/* Liquid background */}
                  <span className="absolute inset-0 bg-gradient-to-r from-[#d5a353] via-[#f0c674] to-[#d5a353] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out"></span>

                  {/* Border */}
                  <span className="absolute inset-0 border-2 border-[#d5a353] group-hover:border-transparent transition-colors duration-700"></span>

                  {/* Particles effect */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <span className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></span>
                    <span className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white rounded-full animate-ping animation-delay-150"></span>
                    <span className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping animation-delay-300"></span>
                  </span>

                  <span className="relative z-10  group-hover:scale-110 inline-block transition-transform duration-300">
                    Make an Appointment
                  </span>
                </button>
              </NavLink>
            </div>

          </div>
        </div>

        {/* Bottom Info Section - Hidden on Mobile, Shown on Desktop */}
        <div className="hidden md:block absolute bottom-0 left-0 right-0 font-bold uppercase">
          <div className="flex justify-around border-t border-gray-500 bg-black/70 backdrop-blur-md py-6 lg:py-8">
            <div className="flex-1 border-r border-gray-500 text-center px-4">
              <h3 className="text-[#d5a353] mb-2 text-base lg:text-lg">Address</h3>
              <p className="text-white text-xs lg:text-sm leading-relaxed">
                123, New Lenox street<br />Washington, D.C. 60606
              </p>
            </div>

            <div className="flex-1 border-r border-gray-500 text-center px-4">
              <h3 className="text-[#d5a353] mb-2 text-base lg:text-lg">Call Us</h3>
              <p className="text-white text-xs lg:text-sm">123-456-7890</p>
              <h3 className="text-[#d5a353] mt-2 text-xs lg:text-sm">For Booking</h3>
            </div>

            <div className="flex-1 text-center px-4">
              <h3 className="text-[#d5a353] mb-2 text-base lg:text-lg">Hours</h3>
              <p className="text-white text-xs lg:text-sm leading-relaxed">
                Monday - Saturday: 11 AM - 9 PM<br />
                Sunday:  OFF
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out 0.3s backwards;
        }
      `}</style>

      {/* About Section */}
      <div className="bg-[#f8f5f0]" id="about">
        <section className="relative grid grid-cols-1 lg:grid-cols-2 items-center">
          {/* Left Image */}
          <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] w-full order-1 lg:order-1">
            <img
              src="/welcombarber.jpg"
              alt="Barbershop Interior"
              className="absolute left-0 top-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Right Text Content */}
          <div className="flex flex-col justify-center max-w-2xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 md:py-20 bg-[#f8f5f0] order-2 lg:order-2">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-black mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-tight"
              style={{ fontFamily: "Luckiest Guy, cursive" }}
            >
              Welcome to Berger
            </h1>

            <p className="italic text-[#d5a353] text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed">
              Berger is an amazing barbershop located in the heart of the Upper West Side Manhattan
            </p>

            <p
              className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-8 sm:mb-10 md:mb-12"
              style={{ fontFamily: "serif" }}
            >
              Step into Berger Barbershop — where modern style meets classic grooming. Our expert barbers are dedicated
              to delivering precision cuts, clean fades, and sharp beard styling in a relaxing atmosphere. Whether you’re
              preparing for an event or just need a refresh, we ensure you leave looking confident and feeling your best.
              Experience the perfect blend of skill, comfort, and style — only at Berger.
            </p>

            <NavLink
              to="/about"
              className="w-fit bg-[#D4AF37] text-black font-bold px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 uppercase tracking-wider text-xs sm:text-sm md:text-base hover:bg-black hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              More About Us
            </NavLink>
          </div>

        </section>
      </div>

      {/* Services Section */}
      <div id="services">
        <Services />
      </div>

      {/* Testimonials Section */}
      <div id="Testimonials">
        <TestimonialSliderHome />
      </div>

      {/* Branches Section */}
      <div id="Branches">
        <BranchesSection />
      </div>

      {/* Staff Section */}
      <div className="overStaf" id="OurStaff">
        <OurStaff />
      </div>

      {/* Price List Section */}
      <div className="price-liist" id="PriceList">
        <PriceList />
      </div>

      {/* Map Location Section */}
      <div className="map" id="VisitUs">
        <LocationMap />
      </div>
    </>
  );
}

export default Home;