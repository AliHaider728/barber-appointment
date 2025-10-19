import React, { useState } from "react";
import StaffCard from "./Staffcard.jsx";
import StaffModal from "./StaffModal";

const staffData = [
  {
    name: "Tony Lynch",
    role: "Master Barber",
    image: "../../../public/staff1.jpg",
    link: "/staff/tony-lynch",
  },
  {
    name: "Leonard Smith",
    role: "Hair Stylist",
    image: "../../../public/satff2.jpg",
    link: "/staff/leonard-smith",
  },
  {
    name: "Steven Brown",
    role: "Senior Barber",
    image: "../../../public/satff3.jpg",
    link: "/staff/steven-brown",
  },
];

const OurStaff = () => {
  const [modalImage, setModalImage] = useState(null);
  const [modalName, setModalName] = useState("");

  const handleImageClick = (image, name) => {
    setModalImage(image);
    setModalName(name);
  };

  const closeModal = () => {
    setModalImage(null);
    setModalName("");
  };

  return (
    <section id="OurStaff" className="bg-white py-20 px-8 lg:px-20 text-center">
     <div className="items-center justify-center text-center ">
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse delay-150"></div>
            </div>
            
            <h2 className="text-5xl lg:text-6xl font-bold text-black uppercase mb-3 tracking-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F4D03F]">Staff</span>
            </h2>
            
            <div className="flex items-center justify-center gap-1 mt-4">
              <div className="w-3 h-3 border-2 border-[#D4AF37] rotate-45"></div>
              <div className="w-20 h-0.5 bg-[#D4AF37]"></div>
              <div className="w-4 h-4 bg-[#D4AF37] rotate-45"></div>
              <div className="w-20 h-0.5 bg-[#D4AF37]"></div>
              <div className="w-3 h-3 border-2 border-[#D4AF37] rotate-45"></div>
            </div>
          </div>
          
          <p className="mt-6 text-gray-600 text-lg max-w-2xl mx-auto">
            Meet our team of skilled professionals dedicated to delivering exceptional service
          </p>
        </div>

     </div>
     

      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {staffData.map((staff, index) => (
          <StaffCard
            key={index}
            staff={staff}
            onImageClick={handleImageClick}
          />
        ))}
      </div>

      <StaffModal image={modalImage} name={modalName} onClose={closeModal} />
    </section>
  );
};

export default OurStaff;
