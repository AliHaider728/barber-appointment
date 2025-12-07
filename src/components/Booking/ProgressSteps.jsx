import React from 'react';
import { Check } from 'lucide-react';

const ProgressSteps = ({ step }) => {
  return (
    <div className="flex justify-between bg-white p-4 rounded-xl">
      {['Branch', 'Services', 'Date & Time', 'Confirm'].map((l, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-[#D4AF37] text-black' : 'bg-gray-200'}`}>
            {step > i + 1 ? <Check className="w-5 h-5" /> : i + 1}
          </div>
          <p className="text-xs font-bold mt-1 hidden sm:block">{l}</p>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;