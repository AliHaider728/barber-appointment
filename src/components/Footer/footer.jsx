import React, { useRef } from "react";
import { Link } from "react-router-dom";
import LaserFlow from "../LaserFlow";
import { Facebook, Instagram, Target, Twitter } from "lucide-react";


const AnimatedFooter = () => {
  const revealImgRef = useRef(null);

  return (
  <>
   <div className="max-w-full">
     <div
      style={{
        height: "700px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty("--mx", `${x}px`);
          el.style.setProperty("--my", `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty("--mx", "-9999px");
          el.style.setProperty("--my", "-9999px");
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.0}
        color="#D4AF37"
      />

      {/* Main Footer Content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[90%] h-[80%] bg-[rgba(10,10,10,0.95)] rounded-2xl border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4),_inset_0_0_20px_rgba(212,175,55,0.1)] z-[6] backdrop-blur-lg px-10 pt-[60px] pb-[30px]">
        <div className="max-w-6xl mx-auto h-full flex flex-col justify-between">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Section */}
            <div>
              <h3 className="text-3xl font-black uppercase mb-3 text-[#D4AF37]">
                Barber Shop
              </h3>
              <div className="w-[50px] h-[3px] bg-[#D4AF37] mb-5"></div>
              <p className="text-gray-400 text-[15px] leading-relaxed">
                Premium grooming and traditional barbering services. Book your
                appointment today for the ultimate grooming experience.
              </p>
              <button
                onClick={() => (window.location.href = "/booking")}
                className="mt-6 bg-[#D4AF37] text-black px-5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-sm border-none cursor-pointer transition-all duration-300 hover:bg-white hover:-translate-y-[2px]"
              >
                Book Now
              </button>
            </div>

            {/* Branches */}
            <div>
              <h4 className="text-base font-bold uppercase mb-4 text-white">
                Our Branches
              </h4>
              <ul className="list-none p-0">
                {[
                  {
                    location: "Downtown Manhattan",
                    address: "123 Main St, NY",
                  },
                  { location: "Brooklyn Heights", address: "456 Park Ave, BK" },
                  { location: "Queens Center", address: "789 Oak Rd, QN" },
                  ].map((branch, idx) => (
                  <li key={idx} className="mb-[14px]">
                    <div className="text-[#D4AF37] text-[15px] font-semibold mb-[2px]">
                      {branch.location}
                    </div>
                    <div className="text-gray-400 text-[11px]">
                      {branch.address}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Appointment Hours */}
            <div className="-ml-5 relative -left-16">
              <h4 className="text-base font-bold uppercase mb-4 text-white">
                Appointment Hours
              </h4>
              <div className="text-[15px]">
                <div className="flex justify-between mb-[10px]">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-[#D4AF37] font-semibold">
                    9AM - 8PM
                  </span>
                </div>
                <div className="flex justify-between mb-[10px]">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-[#D4AF37] font-semibold">
                    10AM - 6PM
                  </span>
                </div>
                <div className="flex justify-between mb-5">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-[#D4AF37] font-semibold">
                    10AM - 5PM
                  </span>
                </div>
                <div className="p-3 bg-[rgba(212,175,55,0.1)] rounded-md mt-4">
                  <p className="text-[#D4AF37] text-[12px] font-semibold">
                    Walk-ins Welcome
                  </p>
                  <p className="text-gray-400 text-[11px] mt-1">
                    Or book online for guaranteed slot
                  </p>
                </div>
              </div>
            </div>

            {/* Contact & Location  */}
            <div>
              <h4 className="text-base font-bold uppercase mb-4 text-white">
                Contact Us
              </h4>
              <div className="text-[15px] mb-5">
                <p className="text-gray-400 mb-2">
                  <strong className="text-[#D4AF37]">Address:</strong>
                  <br />
                  123 Main Street
                  <br />
                  Downtown, NY 10001
                </p>
                <p className="text-gray-400 mb-2">
                  <strong className="text-[#D4AF37]">Phone:</strong>
                  <br />
                  (555) 123-4567
                </p>
                <p className="text-gray-400">
                  <strong className="text-[#D4AF37]">Email:</strong>
                  <br />
                  booking@barbershop.com
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex gap-3 mt-5">
                {[
                  { Icon: Facebook, name: "Facebook", href: "" },
                  { Icon: Instagram, name: "Instagram", href: "" },
                  { Icon: Twitter, name: "Twitter", href: "" },
                ].map(({ Icon, name, href }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    className="w-10 h-10 bg-[rgba(255,255,255,0.05)] flex  hover:shadow-[#D4AF37] hover:shadow-md   items-center justify-center rounded border border-[rgba(212,175,55,0.2)] text-gray-400 text-[11px] font-bold transition-all duration-300  hover:-translate-y-[3px]"
                    aria-label={name}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[rgba(212,175,55,0.2)] pt-5 mt-8">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <p className="text-gray-500 text-[11px]">
                © 2025 Barber Shop. All Rights Reserved.
              </p>
              <div className="flex gap-5">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cancellation Policy",
                ].map((text, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="text-gray-500 text-[11px] no-underline hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    {text}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   </div>
  </>
  );
};

export default AnimatedFooter;
