import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, Calendar, Clock, ChevronRight, Scissors, Check, Home, CalendarPlus, User, Package, CreditCard, AlertCircle } from 'lucide-react';
import PaymentOptions from '../Admin/PaymentOptions';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from '@stripe/react-stripe-js';


// Add fallback and validation for Stripe key
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Only initialize Stripe if key exists
const stripePromise = STRIPE_PUBLIC_KEY ? loadStripe(STRIPE_PUBLIC_KEY) : null;

if (!STRIPE_PUBLIC_KEY) {
  console.error(' VITE_STRIPE_PUBLIC_KEY is not defined in environment variables');
}

const parseTimeOnDate = (t, dateStr) => {
  const [h, m] = t.split(':').map(Number);
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return d;
};

const formatTime = (d) => d.toTimeString().slice(0, 5);
const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);

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

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [gender, setGender] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userDetails, setUserDetails] = useState({ fullName: '', email: '', phone: '' });
  const [errors, setErrors] = useState({ fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(''); // 'card' or 'pay-later'

  const [branches, setBranches] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [branchBarbers, setBranchBarbers] = useState([]);
  const [barberSpecialties, setBarberSpecialties] = useState([]);
  const [barberShift, setBarberShift] = useState(null);
  const [shiftLoading, setShiftLoading] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {  
  try {  
    setFetching(true);  
    const [bRes, sRes, barbRes] = await Promise.all([  
      fetch('https://barber-appointment-backend.vercel.app/api/branches'),  
      fetch('https://barber-appointment-backend.vercel.app/api/services'),  
      fetch('https://barber-appointment-backend.vercel.app/api/barbers')  
    ]);  

    // Helper to parse and validate  
    const parseAndValidate = async (res) => {  
      if (!res.ok) {  
        throw new Error(`HTTP error! status: ${res.status}`);  
      }  
      const data = await res.json();  
      return Array.isArray(data) ? data : []; // Fallback to empty array if not array  
    };  

    const b = await parseAndValidate(bRes);  
    const s = await parseAndValidate(sRes);  
    const barb = await parseAndValidate(barbRes);  

    setBranches(b);  
    setServices(s);  
    setBarbers(barb);  
  } catch (err) {  
    console.error('Fetch error:', err);  
    alert('Failed to load data');  
    // Optionally reset states to empty arrays  
    setBranches([]);  
    setServices([]);  
    setBarbers([]);  
  } finally {  
    setFetching(false);  
  }  
};  
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedBranch && gender) {
      const filtered = barbers.filter(b => {
        const branchMatch = b.branch?._id === selectedBranch || b.branch === selectedBranch;
        const genderMatch = b.gender === gender;
        return branchMatch && genderMatch;
      });

      setBranchBarbers(filtered);
      setSelectedBarber('');
      setSelectedServices([]);
    }
  }, [selectedBranch, gender, barbers]);

  useEffect(() => {
    if (selectedBarber) {
      const barber = barbers.find(b => b._id === selectedBarber);
      if (barber) {
        const specs = services.filter(s => barber.specialties.includes(s.name) && s.gender === gender);
        setBarberSpecialties(specs);
        setSelectedServices([]);
      }
    }
  }, [selectedBarber, barbers, services, gender]);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      const fetchShift = async () => {
        try {
          setShiftLoading(true);
          setBarberShift(null);
          setSelectedTime('');

          const res = await fetch(
            `https://barber-appointment-backend.vercel.app/api/barber-shifts/barber/${selectedBarber}/date/${selectedDate}`
          );

          if (res.ok) {
            const data = await res.json();
            setBarberShift(data);
          } else {
            setBarberShift({ noShift: true });
          }
        } catch (err) {
          console.error('Shift fetch error:', err);
          setBarberShift({ noShift: true });
        } finally {
          setShiftLoading(false);
        }
      };

      fetchShift();
    }
  }, [selectedBarber, selectedDate]);

  useEffect(() => {
    if (selectedBarber && selectedDate) {
      fetch(`https://barber-appointment-backend.vercel.app/api/appointments/barber/${selectedBarber}/date/${selectedDate}`)
        .then(r => {
          if (!r.ok) throw new Error('No bookings');
          return r.json();
        })
        .then(data => {
          setExistingBookings(Array.isArray(data) ? data : []);
        })
        .catch(() => setExistingBookings([]));
    }
  }, [selectedBarber, selectedDate]);

  const totalMinutes = useMemo(() => {
    return selectedServices.reduce((sum, id) => {
      const s = services.find(x => x._id === id);
      return sum + (parseInt(s?.duration?.match(/\d+/)?.[0]) || 0);
    }, 0);
  }, [selectedServices, services]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, id) => {
      const s = services.find(x => x._id === id);
      return sum + parseFloat(s?.price.replace('£', '') || 0);
    }, 0);
  }, [selectedServices, services]);

  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedBarber || totalMinutes === 0 || !barberShift) return [];

    if (barberShift.isOff || barberShift.noShift) return [];

    const shiftStart = parseTimeOnDate(barberShift.startTime, selectedDate);
    const shiftEnd = parseTimeOnDate(barberShift.endTime, selectedDate);

    const slots = [];
    let current = new Date(shiftStart);

    const now = new Date();
    const isToday = selectedDate === now.toISOString().split('T')[0];

    while (current.getTime() + totalMinutes * 60000 <= shiftEnd.getTime()) {
      if (isToday && current < now) {
        current = addMinutes(current, totalMinutes);
        continue;
      }

      const slotEnd = addMinutes(current, totalMinutes);

      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.date);
        const bookingEnd = addMinutes(bookingStart, booking.duration);

        return (current < bookingEnd && slotEnd > bookingStart);
      });

      if (!hasConflict) {
        slots.push({
          start: formatTime(current),
          end: formatTime(slotEnd),
          available: true
        });
      }

      current = addMinutes(current, totalMinutes);
    }

    
    return slots;
  }, [selectedDate, selectedBarber, totalMinutes, barberShift, existingBookings]);

  const handleServiceToggle = id => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // VALIDATION FUNCTIONS
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phone.trim()) return 'Phone number is required';
    if (!phoneRegex.test(phone)) return 'Please enter a valid phone number (min 10 digits)';
    return '';
  };

  const validateFullName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (name.trim().length < 3) return 'Name must be at least 3 characters';
    return '';
  };

  const handleInputChange = (field, value) => {
    setUserDetails(prev => ({ ...prev, [field]: value }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep4 = () => {
    const newErrors = {
      fullName: validateFullName(userDetails.fullName),
      email: validateEmail(userDetails.email),
      phone: validatePhone(userDetails.phone)
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleNext = async () => {
    if (step === 1 && !selectedBranch) {
      alert('Please select a branch');
      return;
    }

    if (step === 2 && (!gender || !selectedBarber || selectedServices.length === 0)) {
      alert('Please complete all selections');
      return;
    }

    if (step === 3 && (!selectedDate || !selectedTime)) {
      alert('Please select date and time');
      return;
    }

    if (step === 3) {
      const slot = timeSlots.find(s => s.start === selectedTime);
      if (!slot?.available) {
        alert('Selected slot is not available');
        return;
      }
    }

    if (step === 4) {
      // Validate all fields before allowing to proceed
      if (!validateStep4()) {
        alert('Please fill in all details correctly');
        return;
      }

      // Check if payment method is selected
      if (!paymentMethod) {
        alert('Please select a payment method');
        return;
      }

      // If card payment, don't proceed - let Stripe handle it
      if (paymentMethod === 'card') {
        // The PaymentOptions component will handle the booking
        return;
      }

      // If pay later
      if (paymentMethod === 'pay-later') {
        await handlePayLaterBooking();
        return;
      }
    }

    setStep(s => s + 1);
  };

  const handlePayLaterBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        customerName: userDetails.fullName,
        email: userDetails.email,
        phone: userDetails.phone,
        date: `${selectedDate}T${selectedTime}:00`,
        selectedServices: selectedServices.map(id => {
          const s = services.find(x => x._id === id);
          return { serviceRef: id, name: s.name, price: s.price, duration: s.duration };
        }),
        barber: selectedBarber,
        branch: selectedBranch,
        duration: totalMinutes,
        totalPrice,
        payOnline: false
      };

      const res = await fetch('https://barber-appointment-backend.vercel.app/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Booking failed');
      const data = await res.json();
      setBookingRef(data._id);
      setBookingComplete(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

const selectedBranchData = Array.isArray(branches) ? branches.find(b => b._id === selectedBranch) : null;    const selectedBarberData = barbers.find(b => b._id === selectedBarber);
  const selectedServicesData = selectedServices.map(id => services.find(s => s._id === id));
  const selectedTimeSlot = timeSlots.find(s => s.start === selectedTime);

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><Scissors className="w-12 h-12 animate-spin text-[#D4AF37]" /></div>;

  if (bookingComplete) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="text-center p-12 border-2 border-[#D4AF37]">
        <div className="w-20 h-20 bg-green-500 text-white rounded-full mx-auto mb-6 flex items-center justify-center">
          <Check className="w-12 h-12" />
        </div>
        <h1 className="text-2xl font-black mb-4">Booking Confirmed!</h1>
        <p className="text-2xl mb-6">Reference: <strong>{bookingRef}</strong></p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.location.href = '/'}><Home className="w-4 h-4 mr-2" />Home</Button>
          <Button onClick={() => window.location.reload()}><CalendarPlus className="w-4 h-4 mr-2" />Book Again</Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto p-6 pt-9">
        <div className="text-center mb-8">
          <Scissors className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-4xl font-black uppercase">Book Appointment</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                        setBookingRef(ref);
                        setBookingComplete(true);
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

            <div className="flex justify-between">
              {step > 1 && step < 4 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>}
              {step < 4 && (
                <Button onClick={handleNext} disabled={loading} className="ml-auto">
                  Next <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
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
                        <p className="font-bold">{new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        <p className="text-xs text-gray-600">{selectedTime} - {selectedTimeSlot?.end} ({totalMinutes} min)</p>
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
                      <span className="text-2xl font-black text-[#D4AF37]">£{totalPrice.toFixed(2)}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;