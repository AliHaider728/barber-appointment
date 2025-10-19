import React from "react";
import { NavLink, useParams } from "react-router-dom";

const staffDetails = {
  "steven-brown": {
    name: "Steven Brown",
    role: "Senior Barber",
    phone: "+1 (800) 456 7890",
    email: "name@yourwebsite.com",
    description: `Lorem ipsum dolor sit amet, te duo labitur dolores. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.`,
    image: "/staff3.jpg",
  },
  "tony-lynch": {
    name: "Tony Lynch",
    role: "Master Barber",
    phone: "+1 (800) 111 2222",
    email: "tony@yourwebsite.com",
    description: `Ut tristique pretium tellus, sed fermentum est vestibulum id.`,
    image: "/staff1.jpg",
  },
  "leonard-smith": {
    name: "Leonard Smith",
    role: "Hair Stylist",
    phone: "+1 (800) 333 4444",
    email: "leonard@yourwebsite.com",
    description: `Aenean semper odio sed fringilla blandit.`,
    image: "/staff2.jpg",
  },
};

const StaffDetail = () => {
  const { staffId } = useParams();
  const staff = staffDetails[staffId];

  if (!staff) return <p className="text-center py-20 text-gray-600">Staff not found.</p>;

  return (
    <section className="bg-[#f8f5f0] py-20 px-6 md:px-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src={staff.image}
          alt={staff.name}
          className="rounded-lg shadow-lg w-full h-[500px] object-cover"
        />
        <div>
          <h1 className="text-4xl font-bold text-black mb-2">{staff.name}</h1>
          <h3 className="text-[#d5a353] text-lg mb-6">{staff.role}</h3>
          <p className="text-gray-700 mb-8 leading-relaxed">{staff.description}</p>
          <p className="mb-2"><strong>Phone:</strong> {staff.phone}</p>
          <p className="mb-6"><strong>Email:</strong> {staff.email}</p>

          <NavLink
            to={`/appointment?barber=${encodeURIComponent(staff.name)}`}
            className="inline-block px-6 py-3 bg-[#d5a353] text-black font-semibold uppercase hover:bg-[#c49343] transition-colors shadow-md"
          >
            Book Appointment with {staff.name}
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default StaffDetail;
    