import React from 'react';
import { Link } from 'react-router-dom';

const prices = [
 { name: "Men's Haircut", duration: "30 minutes", price: "£25" },
  { name: "Beard Trim", duration: "20 minutes", price: "£15" },
  { name: "Hair Color", duration: "45 minutes", price: "£40" },
  { name: "Facial & Grooming", duration: "40 minutes", price: "£35" },
  { name: "Kids Haircut", duration: "25 minutes", price: "£20" },
  { name: "Head Massage", duration: "30 minutes", price: "£30" },
];

const PriceList = () => {
  return (
    <div className="bg-[#faf7f2] min-h-screen" id="PriceList">
      <section className="relative grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left Image - Full Edge */}
        <div className="relative h-[500px] lg:h-[700px] w-full overflow-hidden">
          <img
            src="/Prices-List.jpg"
            alt="Barber tools"
            className="absolute left-0 top-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"></div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-center max-w-[650px] px-8 lg:px-20 py-16 lg:py-20 bg-[#faf7f2]">
          {/* Header Section */}
          <div className="mb-10">
            <h2 className="text-5xl lg:text-6xl font-black text-black mb-4 uppercase tracking-tight">
              Price List
            </h2>
            <div className="w-16 h-1 bg-[#D4AF37] mb-6"></div>
            <p className="text-gray-600 text-base leading-relaxed">
              Select a haircut or beard trim service below and enjoy our premium
              experience performed by professional barbers.
            </p>
          </div>

          {/* Price Table with hover effects */}
          <div className="space-y-2 mb-10">
            {prices.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 pb-3 pt-3 text-lg group hover:bg-gray-50 hover:border-[#D4AF37] transition-all duration-300"
              >
                <span className="font-semibold text-gray-800 group-hover:text-black transition-colors">
                  {item.name}
                </span>
                <span className="text-[#D4AF37] font-bold text-xl group-hover:scale-110 transition-transform">
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          {/* Button - Link to Services Page */}
          <Link to="/services/all">
            <button className="w-fit bg-[#D4AF37] text-black font-bold px-5 py-3.5 uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
              View All
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PriceList;