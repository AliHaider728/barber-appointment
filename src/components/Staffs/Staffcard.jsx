import React, { useState } from "react";
import { FaSearchPlus, FaLink } from "react-icons/fa";

const StaffCard = ({ staff, onImageClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="max-w-7xl">
      <div 
        className="relative text-center w-full max-w-xs mx-auto group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container with Overlay */}
        <div className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-[#d5a353]/20">
          <img
            src={staff.image}
            alt={staff.name}
            className="w-full h-[380px] object-cover transform transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
          />
          
          {/* Gradient Overlay - Only on Hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          
          {/* Animated Border Effect - Only on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d5a353] to-transparent animate-shimmer" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d5a353] to-transparent animate-shimmer-delayed" />
          </div>

           
        </div>

        {/* Name & Role Container - Always Visible */}
        <div className="mt-5 relative">
          {/* Decorative Line */}
          <div className={`h-0.5 bg-gradient-to-r from-transparent via-[#d5a353] to-transparent mb-4 transition-all duration-500 ${isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'} mx-auto`} />
          
          <h3 className="text-xl font-bold text-gray-900 leading-tight transition-all duration-300 group-hover:text-[#d5a353] group-hover:scale-105">
            {staff.name}
          </h3>
          
          <div className="relative inline-block mt-2">
            <p className="text-[#d5a353] text-sm font-semibold uppercase tracking-wider relative z-10 transition-all duration-300 group-hover:tracking-widest">
              {staff.role}
            </p>
            {/* Underline Animation */}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-[#d5a353] transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'}`} />
          </div>
        </div>

        {/* Bottom Action Buttons - Always Visible */}
        <div className="flex justify-center gap-3 mt-6 transition-all duration-300">
          <button
            onClick={() => onImageClick(staff.image, staff.name)}
            className="relative bg-white border-2 border-[#d5a353] text-[#d5a353] p-3 rounded-lg transition-all duration-300 hover:bg-[#d5a353] hover:text-white hover:shadow-lg hover:scale-110 overflow-hidden group/btn"
          >
            <span className="absolute inset-0 bg-[#d5a353] transform -translate-x-full transition-transform duration-300 group-hover/btn:translate-x-0" />
            <FaSearchPlus className="relative z-10" />
          </button>

          <a
            href={staff.link}
            className="relative bg-white border-2 border-[#d5a353] text-[#d5a353] p-3 rounded-lg transition-all duration-300 hover:bg-[#d5a353] hover:text-white hover:shadow-lg hover:scale-110 overflow-hidden group/btn"
          >
            <span className="absolute inset-0 bg-[#d5a353] transform translate-x-full transition-transform duration-300 group-hover/btn:translate-x-0" />
            <FaLink className="relative z-10" />
          </a>
        </div>

        {/* Corner Accent */}
        <div className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-[#d5a353] to-[#c99442] rounded-full blur-xl transition-all duration-500 ${isHovered ? 'opacity-30 scale-150' : 'opacity-0 scale-100'}`} />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-shimmer-delayed {
          animation: shimmer 2s infinite 0.5s;
        }
      `}</style>
    </div>
  );
};

export default StaffCard;