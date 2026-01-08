import React from 'react';
import { Calendar, MapPin, User, Package, Clock, CreditCard } from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>{children}</div>
);

const BookingSummary = ({ 
  selectedBranchData, 
  selectedBarberData, 
  selectedServicesData, 
  selectedDate, 
  selectedTime, 
  selectedTimeSlot, 
  totalPrice, 
  totalMinutes 
}) => {
  return (
    <Card className="sticky top-6 border-2 border-[#D4AF37]">
      <h3 className="text-lg font-black mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#D4AF37]" />
        Booking Summary
      </h3>

      <div className="space-y-4 text-sm">
        {selectedBranchData && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Branch</p>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{selectedBranchData.name}</p>
                <p className="text-xs text-gray-600">{selectedBranchData.city}</p>
              </div>
            </div>
          </div>
        )}

        {selectedBarberData && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Barber</p>
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{selectedBarberData.name}</p>
                <p className="text-xs text-gray-600">{selectedBarberData.experienceYears} years experience</p>
              </div>
            </div>
          </div>
        )}

        {selectedServicesData.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Services</p>
            <div className="flex items-start gap-2">
              <Package className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1">
                {selectedServicesData.map(s => s && (
                  <div key={s._id} className="flex justify-between gap-4">
                    <span className="font-medium">{s.name}</span>
                    <span className="text-[#D4AF37] font-bold">{s.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedDate && selectedTime && (
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Date & Time</p>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  {new Date(selectedDate).toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
                <p className="text-xs text-gray-600">
                  {selectedTime} - {selectedTimeSlot?.end} ({totalMinutes} min)
                </p>
              </div>
            </div>
          </div>
        )}

        {totalPrice > 0 && (
          <div className="pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                <span className="font-bold">Total</span>
              </div>
              <span className="text-2xl font-black text-[#D4AF37]">
                £{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {!selectedBranchData && !selectedBarberData && selectedServicesData.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Your selections will appear here</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BookingSummary;