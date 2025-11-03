import React, { useRef } from "react";
import { Link } from "react-router-dom";
import LaserFlow from "../LaserFlow";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { NavLink } from "react-router-dom";

const AnimatedFooter = () => {
  const revealImgRef = useRef(null);

  return (
    <>
      <div className="max-w-full">
        <div
          style={{
            height: "650px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#0a0a0a",
          }}
          className="responsive-footer-section"
        >
          {/* LaserFlow - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block w-full h-full absolute top-0 left-0">
            <LaserFlow
              horizontalBeamOffset={0.2}
              verticalBeamOffset={0.1}
              color="#D4AF37"
            />
          </div>

          <style>
            {`
              @media (max-width: 1024px) {
                .responsive-footer-section {
                  height: auto !important;
                  min-height: 100vh !important;
                  padding-bottom: 50px !important;
                }
              }

              @media (max-width: 768px) {
                .responsive-footer-section {
                  height: auto !important;
                  min-height: fit-content !important;
                  padding-bottom: 30px !important;
                }
              }

              @media (max-width: 480px) {
                .responsive-footer-section {
                  height: auto !important;
                  min-height: fit-content !important;
                  padding-bottom: 20px !important;
                }
              }
            `}
          </style>

          {/* Main Footer Content */}
          <div className="relative top-8 md:absolute md:top-[40.3%] md:h-96 h-fit left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-[90%] bg-[rgba(10,10,10,0.95)] rounded-2xl border-2 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.4),_inset_0_0_20px_rgba(212,175,55,0.1)] z-[6] backdrop-blur-lg p-6 md:p-16 mx-auto">
            <div className="max-w-6xl mx-auto max-h-fit flex flex-col justify-between">
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {/* Brand Section */}
                <div>
                  <h3 className="text-3xl font-black uppercase mb-3 text-[#D4AF37]">
                    Barber Shop
                  </h3>
                  <div className="w-[50px] h-[3px] bg-[#D4AF37] mb-5"></div>
                  <p className="text-gray-400 text-[15px] leading-relaxed mb-4">
                    Premium grooming and traditional barbering services. Book
                    your appointment today for the ultimate grooming experience.
                  </p>
                  <NavLink
                    to="/booking"
                    className="inline-block bg-[#D4AF37] text-black px-5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-sm border-none cursor-pointer transition-all duration-300 hover:bg-white hover:-translate-y-[2px]"
                  >
                    Book Now
                  </NavLink>
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
                      {
                        location: "Brooklyn Heights",
                        address: "456 Park Ave, BK",
                      },
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
                <div className="lg:-ml-5 lg:relative lg:-left-16">
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

                {/* Contact & Location */}
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
                      { Icon: Facebook, name: "Facebook", href: "#" },
                      { Icon: Instagram, name: "Instagram", href: "#" },
                      { Icon: Twitter, name: "Twitter", href: "#" },
                    ].map(({ Icon, name, href }, idx) => (
                      <a
                        key={idx}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-[rgba(255,255,255,0.05)] flex hover:shadow-[#D4AF37] hover:shadow-md items-center justify-center rounded border border-[rgba(212,175,55,0.2)] text-gray-400 text-[11px] font-bold transition-all duration-300 hover:-translate-y-[3px]"
                        aria-label={name}
                      >
                        <Icon size={20} />
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