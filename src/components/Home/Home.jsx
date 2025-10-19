import React from "react";
import { NavLink } from "react-router-dom";
import SidebarEngles from "../SidebarEngles";
import TestimonialSliderHome from "../TestimonialSliderHome";
import OurStaff from "../Staffs/OurStaff";
import PriceList from "../PriceList";
import LocationMap from "../LocationMap";
import Services from "../Service/Services";



function Home() {
  return (
    <>
      <div className="relative min-h-screen" id="#banner">
        {/* Background Image - Fixed Behind Everything */}
        <div
          className="fixed top-0 left-0 w-full h-full -z-10"
          style={{
            backgroundImage: 'url("/banner_home.jpg")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        />
          <SidebarEngles/>
        {/* Hero Content Section */}
        <div className="flex flex-col justify-center items-center text-center min-h-screen pt-32 pb-40 px-4">
          <img src="/logo_home.png" alt="Logo" className="mb-8 max-w-xs" />

          <div className="mb-16">
            <h4 className="text-white text-xl md:text-2xl mb-6 max-w-2xl drop-shadow-lg">
              Premium Barbershop is the prime spot for your hair grooming needs
              in your city
            </h4>
            <NavLink
              to="/appointment"
              className="inline-block px-8 py-4 bg-[#d5a353] text-black uppercase font-semibold hover:bg-[#c49343] transition-colors shadow-lg"
            >
              Make an Appointment
            </NavLink>
          </div>
        </div>

        {/* Bottom Info Section - Full Width */}
        <div className="absolute bottom-0 left-0 right-0 font-bold uppercase flex flex-wrap md:flex-nowrap justify-around border-t border-gray-300 bg-black/50 backdrop-blur-sm py-6 md:py-8">
          <div className="flex-1 border-r border-gray-400 text-center px-4 min-w-[250px]">
            <h3 className="text-[#d5a353] mb-2 text-lg">Address</h3>
            <p className="text-white text-sm">
              123, New Lenox street Washington, <br /> D.C. 60606
            </p>
          </div>

          <div className="flex-1 border-r border-gray-400 text-center px-4 min-w-[250px]">
            <h3 className="text-[#d5a353] mb-2 text-lg">Call Us</h3>
            <p className="text-white text-sm">123-456-7890</p>
            <h3 className="text-[#d5a353] mt-2 text-sm">For Booking</h3>
          </div>

          <div className="flex-1 text-center px-4 min-w-[250px]">
            <h3 className="text-[#d5a353] mb-2 text-lg">Hours</h3>
            <p className="text-white text-sm">
              Monday through Saturday 11 AM - 9 PM <br /> Sunday 11 AM - 7 PM
            </p>
          </div>
        </div>
      </div>

      {/* About section */}
      <div className="bg-[#f8f5f0]" id="about">
        {/* About Section */}
        <section className="relative grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Left Image - Full Edge */}
          <div className="relative h-[500px] md:h-[650px] w-full">
            <img
              src="/welcombarber.jpg"
              alt="Barbershop Interior"
              className="absolute left-0 top-0 w-full h-full object-cover md:rounded-r-[0px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>
          </div>

          {/* Right Text Content */}
          <div className="flex flex-col justify-center max-w-xl px-8 md:px-20 py-20 bg-[#f8f5f0]">
            <h1 className="text-4xl md:text-5xl font-extrabold text-black mb-12 leading-tight" style={{fontFamily:"Luckiest Guy cursive" } }>
              Welcome to Berger
            </h1>

            <p className="italic text-[#d5a353] text-lg mb-12">
              Berger is an amazing barbershop located in the heart of the Upper
              West Side Manhattan
            </p>

            <p className="text-gray-700 text-base leading-relaxed mb-12" style={{fontFamily:"sarif"}} >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in.
            </p>

            <NavLink
              to="/about-us"
              className="w-fit bg-[#D4AF37] text-black font-bold px-5 py-3.5 uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5"
             >
              More About Us
            </NavLink>
            
          </div>
        </section>
      </div>

      {/* Our Services Section */}
   <div className="" id="services">
     <Services/>
   </div>

      {/* Testimonials */}
      <div id="Testimonials" >
         <TestimonialSliderHome/>
      </div>

      {/* OverStaff */}
      <div className="overStaf" id="OurStaff">
        <OurStaff/>
      </div>
       {/* Price-List */}
       <div className="price-liist" id="PriceList">
        <PriceList/>
       </div>

       {/* mapLocation */}
       <div className="map" id="VisitUs">
        <LocationMap  />
       </div>
    </>
  );
}

export default Home;
