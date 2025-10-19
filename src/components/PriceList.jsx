import React from "react";

const prices = [
  { service: "Haircut", price: "$25" },
  { service: "Beard Trim", price: "$15" },
  { service: "Haircut + Shave", price: "$35" },
  { service: "Razor Fade", price: "$30" },
  { service: "Kids Cut", price: "$20" },
];

const PriceList = () => {
  return (
    <div className="bg-[#faf7f2] min-h-screen" id="PriceList">
      <section className="relative grid grid-cols-1 lg:grid-cols-2 items-center">
        {/* Left Image - Full Edge */}
        <div className="relative h-[500px] lg:h-[700px] w-full overflow-hidden">
          <img
            src="../../public/Prices-List.jpg"
            alt="Barber tools"
            className="absolute left-0 top-0 w-full h-full object-cover"
          />
          {/* Enhanced gradient overlay */}
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
                className="flex justify-between items-center border-b border-gray-200 pb-3 pt-3 text-lg group hover:border-[#D4AF37] transition-all duration-300"
              >
                <span className="font-semibold text-gray-800 group-hover:text-black transition-colors">
                  {item.service}
                </span>
                <span className="text-[#D4AF37] font-bold text-xl group-hover:scale-110 transition-transform">
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          {/* Button - Reduced Width */}
          <button className="w-fit bg-[#D4AF37] text-black font-bold px-5 py-3.5 uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5">
            Make an Appointment
          </button>
        </div>
      </section>
    </div>
  );
};

export default PriceList;