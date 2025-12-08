import React from 'react';
import { MapPin, AlertCircle, Clock, ChevronRight, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PaymentOptions from  "../Admin/PaymentOptions.jsx";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const stripePromise = STRIPE_PUBLIC_KEY ? loadStripe(STRIPE_PUBLIC_KEY) : null;

const MaleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="6" r="4" />
    <path d="M12 10v4m-2 0h4" />
    <path d="M8 14h8v8H8z" />
  </svg>
);


const FemaleIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="6" r="4" />
    <path d="M12 10v4m-2 0h4" />
    <path d="M8 18h8v4H8z" />
  </svg>
);

const Button = ({ children, className = '', variant = 'default', onClick, disabled, ...props }) => {
  const base = 'px-4 py-2 rounded-lg font-bold flex items-center justify-center transition-all';
  const styles = variant === 'outline'
    ? 'border-2 bg-white hover:bg-gray-50 text-black'
    : 'bg-[#D4AF37] text-black hover:bg-black hover:text-white';
  return <button className={`${base} ${styles} ${className}`} onClick={onClick} disabled={disabled} {...props}>{children}</button>;
};

const Card = ({ children, className = '', onClick }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`} onClick={onClick}>{children}</div>
);

const Input = ({ className = '', error, ...props }) => (
  <div className="w-full">
    <input
      className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 focus:ring-[#D4AF37] ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
      {...props}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const StepContent = ({
  step,
  branches,
  selectedBranch,
  setSelectedBranch,
  gender,
  setGender,
  branchBarbers,
  selectedBarber,
  setSelectedBarber,
  barberSpecialties,
  selectedServices,
  handleServiceToggle,
  totalPrice,
  totalMinutes,
  selectedDate,
  setSelectedDate,
  shiftLoading,
  barberShift,
  timeSlots,
  selectedTime,
  setSelectedTime,
  isLoggedIn,
  userDetails,
  errors,
  handleInputChange,
  paymentMethod,
  setPaymentMethod,
  loading,
  handleNext,
  today,
  setBookingRef,
  setBookingComplete
}) => {
  const navigate = useNavigate();

  return (
    <>
      {step === 1 && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Select Branch</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {branches.map(b => (
              <Card key={b._id} className={`cursor-pointer border-2 transition-all ${selectedBranch === b._id ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedBranch(b._id)}>
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-sm">{b.name}</p>
                    <p className="text-xs text-gray-600">{b.city}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Select Services</h2>
          {!gender && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button variant={gender === 'male' ? 'default' : 'outline'} onClick={() => setGender('male')} className="h-20 flex-col gap-2">
                <MaleIcon />
                <span className="text-sm">Male</span>
              </Button>
              <Button variant={gender === 'female' ? 'default' : 'outline'} onClick={() => setGender('female')} className="h-20 flex-col gap-2">
                <FemaleIcon />
                <span className="text-sm">Female</span>
              </Button>
            </div>
          )}
          {gender && !selectedBarber && (
            <div className="mb-4">
              <h3 className="font-bold mb-3 text-sm">Select Barber</h3>
              {branchBarbers.length === 0 ? (
                <p className="text-red-600 text-sm">No {gender} barbers available at this branch</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {branchBarbers.map(b => (
                    <Card key={b._id} className={`cursor-pointer border-2 transition-all ${selectedBarber === b._id ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-200'}`} onClick={() => setSelectedBarber(b._id)}>
                      <p className="font-bold text-sm">{b.name}</p>
                      <p className="text-xs text-gray-600">{b.experienceYears} years experience</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          {selectedBarber && (
            <div>
              <h3 className="font-bold mb-3 text-sm">Select Services</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {barberSpecialties.map(s => (
                  <Card key={s._id} className={`cursor-pointer border-2 transition-all ${selectedServices.includes(s._id) ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-200'}`} onClick={() => handleServiceToggle(s._id)}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm">{s.name}</p>
                        <p className="text-xs text-gray-600">{s.duration}</p>
                      </div>
                      <p className="text-[#D4AF37] font-black text-sm">{s.price}</p>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="font-black text-sm">Total: £{totalPrice.toFixed(2)} | {totalMinutes} min</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {step === 3 && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>
          <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={today} className="mb-4" />

          {shiftLoading && (
            <div className="text-center py-8">
              <Clock className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto mb-2" />
              <p className="text-sm text-gray-600">Checking availability...</p>
            </div>
          )}

          {!shiftLoading && selectedDate && barberShift?.isOff && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="font-bold text-red-700 mb-1">Barber is Off</p>
              <p className="text-sm text-red-600">This barber is not available on the selected date. Please choose another date or barber.</p>
            </div>
          )}

          {!shiftLoading && selectedDate && barberShift?.noShift && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 text-center">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
              <p className="font-bold text-orange-700 mb-1">No Shift Scheduled</p>
              <p className="text-sm text-orange-600">This barber has no working hours set for this day. Please contact the salon or choose another date.</p>
            </div>
          )}

          {!shiftLoading && selectedDate && barberShift && !barberShift.isOff && !barberShift.noShift && timeSlots.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm">Available Slots ({totalMinutes} min)</h3>
                <p className="text-xs text-gray-600">Shift: {barberShift.startTime} - {barberShift.endTime}</p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.map(slot => (
                  <Button
                    key={slot.start}
                    variant={selectedTime === slot.start ? 'default' : 'outline'}
                    onClick={() => setSelectedTime(selectedTime === slot.start ? '' : slot.start)}
                    disabled={selectedTime && selectedTime !== slot.start}
                    className={`h-12 text-xs ${selectedTime && selectedTime !== slot.start ? 'opacity-50' : ''}`}
                  >
                    {slot.start}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!shiftLoading && selectedDate && barberShift && !barberShift.isOff && !barberShift.noShift && timeSlots.length === 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
              <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
              <p className="font-bold text-yellow-700 mb-1">No Available Slots</p>
              <p className="text-sm text-yellow-600">All time slots are booked for this date. Try selecting fewer services or choose another date.</p>
            </div>
          )}
        </Card>
      )}

      {step === 4 && (
        <>
          {!isLoggedIn ? (
            <Card>
              <h2 className="text-xl font-bold mb-4">Authentication Required</h2>
              <p className="mb-6 text-gray-600">Please sign in or create an account to fill in your details and complete your booking, just like in real-world applications.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="w-full" onClick={() => navigate('/login')}>Login</Button>
                <Button className="w-full" variant="outline" onClick={() => navigate('/login')}>Signup</Button>
              </div>
            </Card>
          ) : (
            <Card>
              <h2 className="text-xl font-bold mb-4">Your Details</h2>
              <div className="space-y-4 mb-6">
                <Input
                  placeholder="Full Name"
                  value={userDetails.fullName}
                  onChange={e => handleInputChange('fullName', e.target.value)}
                  error={errors.fullName}
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={userDetails.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  error={errors.email}
                  readOnly={true}
                  className="bg-gray-100 cursor-not-allowed"
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={userDetails.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  error={errors.phone}
                />
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div className="mb-6">
                <h3 className="font-bold mb-3">Select Payment Method</h3>
                <div className="space-y-3">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                        {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>}
                      </div>
                      <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-bold">Pay with Card</span>
                    </div>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'pay-later' ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onClick={() => setPaymentMethod('pay-later')}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'pay-later' ? 'border-[#D4AF37]' : 'border-gray-300'}`}>
                        {paymentMethod === 'pay-later' && <div className="w-3 h-3 rounded-full bg-[#D4AF37]"></div>}
                      </div>
                      <Clock className="w-5 h-5 text-[#D4AF37]" />
                      <span className="font-bold">Pay at Salon</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STRIPE CARD FORM - Only show when card is selected */}
              {paymentMethod === 'card' && stripePromise && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    appearance: { theme: 'stripe' },
                    locale: 'en'
                  }}
                >
                  <PaymentOptions
                    appointmentData={{
                      customerName: userDetails.fullName,
                      email: userDetails.email,
                      phone: userDetails.phone,
                      date: `${selectedDate}T${selectedTime}:00`,
                      selectedServices: selectedServices.map(id => ({ serviceRef: id })),
                      barber: selectedBarber,
                      branch: selectedBranch,
                      duration: totalMinutes,
                      totalPrice
                    }}
                    onSuccess={(ref) => {
                      if (typeof setBookingRef === 'function') {
                        setBookingRef(ref);
                      }
                      if (typeof setBookingComplete === 'function') {
                        setBookingComplete(true);
                      }
                    }}
                  />
                </Elements>
              )}
              {paymentMethod === 'pay-later' && (
                <Button
                  onClick={handleNext}
                  disabled={loading}
                  className="w-full bg-[#D4AF37] hover:bg-black hover:text-white text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
                >
                  {loading ? 'Booking...' : `Book Now - Pay at Salon (£${totalPrice.toFixed(2)})`}
                </Button>
              )}
            </Card>
          )}
        </>
      )}
    </>
  );
};


export default StepContent;