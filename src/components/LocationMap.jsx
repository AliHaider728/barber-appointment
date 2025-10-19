import React from "react";

const LocationMap = () => {
  return (
    <div className="bg-[#faf7f2]" id="VisitUs">
      <section className="relative grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left Content */}
        <div className="flex flex-col justify-center max-w-[650px] px-8 lg:px-20 py-16 lg:py-20 bg-[#faf7f2]">
          {/* Header Section */}
          <div className="mb-10">
            <h2 className="text-5xl lg:text-6xl font-black text-black mb-4 uppercase tracking-tight">
              Visit Us
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mb-6"></div>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Stop by our premium barbershop for a classic grooming experience. 
              Walk-ins welcome or book your appointment today.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 mb-10">
            <div className="group">
              <h3 className="text-[#D4AF37] font-bold text-sm uppercase tracking-wide mb-2">
                Address
              </h3>
              <p className="text-gray-800 text-lg font-semibold">
                123 Main Street, Downtown
              </p>
              <p className="text-gray-600">
                New York, NY 10001
              </p>
            </div>

            <div className="group">
              <h3 className="text-[#D4AF37] font-bold text-sm uppercase tracking-wide mb-2">
                Hours
              </h3>
              <p className="text-gray-800 font-semibold">Mon - Fri: 9AM - 8PM</p>
              <p className="text-gray-800 font-semibold">Sat - Sun: 10AM - 6PM</p>
            </div>

            <div className="group">
              <h3 className="text-[#D4AF37] font-bold text-sm uppercase tracking-wide mb-2">
                Contact
              </h3>
              <p className="text-gray-800 font-semibold">(555) 123-4567</p>
              <p className="text-gray-800">info@barbershop.com</p>
            </div>
          </div>

          {/* Button */}
          <button className="w-fit bg-[#D4AF37] text-black font-bold px-6 py-3 uppercase tracking-wide text-xs hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
            Get Directions
          </button>
        </div>

        {/* Right Map */}
        <div className="relative h-[500px] lg:h-[700px] w-full overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841374588093!2d-73.98784668459395!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="absolute inset-0"
          ></iframe>
          {/* Overlay effect */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-l from-transparent via-transparent to-black/5"></div>
        </div>
      </section>
    </div>
  );
};

export default LocationMap;