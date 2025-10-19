import React from "react";

const StaffModal = ({ image, name, onClose }) => {
  if (!image) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="max-h-[90vh] max-w-[100vw] rounded-lg shadow-lg"
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-white text-black rounded-full p-2 hover:bg-[#D4AF37] transition"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default StaffModal;
