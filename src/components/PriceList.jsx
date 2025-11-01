import React from "react";
import { Link } from "react-router-dom";

const prices = [
  { name: "Men's Haircut", duration: "30 minutes", price: "£25" },
  { name: "Beard Trim", duration: "20 minutes", price: "£15" },
  { name: "Hair Color", duration: "45 minutes", price: "£40" },
  { name: "Facial & Grooming", duration: "40 minutes", price: "£35" },
  { name: "Kids Haircut", duration: "25 minutes", price: "£20" },
  { name: "Head Massage", duration: "30 minutes", price: "£30" },
  { name: "Shave", duration: "20 minutes", price: "£18" },
];

const PriceList = () => {
  return (
    <div className="bg-[#faf7f2]" id="PriceList">
      <section className="grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto">
        {/* Left Image */}
        <div className="relative h-64 lg:h-full w-full overflow-hidden">
          <img
            src="/Prices-List.jpg"
            alt="Barber tools"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col justify-center px-6 py-12 lg:px-16 lg:py-16 max-w-xl lg:max-w-none">
          <div className="mb-8">
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-3 uppercase tracking-tight">
              Price List
            </h2>
            <div className="w-14 h-0.5 bg-[#D4AF37] mb-4"></div>
            <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
              Select a haircut or beard trim service below and enjoy our premium
              experience performed by professional barbers.
            </p>
          </div>

          <div className="space-y-2 mb-8">
            {prices.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-200 pb-2.5 pt-2.5 text-base group hover:bg-gray-50 hover:border-[#D4AF37] transition-all duration-300"
              >
                <span className="font-semibold text-gray-800 group-hover:text-black">
                  {item.name}
                </span>
                <span className="text-[#D4AF37] font-bold text-lg group-hover:scale-110 transition-transform">
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          <Link to="/services/all">
            <button className="w-fit bg-[#D4AF37] text-black font-bold px-5 py-3 uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-lg">
              View All
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PriceList;