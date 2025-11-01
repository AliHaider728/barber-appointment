import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, User, ChevronRight, Scissors, Check, Home, CalendarPlus } from 'lucide-react';

// Reusable Components
const Button = ({ children, className = '', variant = 'default', onClick, disabled, ...props }) => {
  const baseStyles = 'px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center';
  const variantStyles = variant === 'outline' 
    ? 'border-2 bg-white hover:bg-gray-50 text-black' 
    : 'bg-[#D4AF37] text-black hover:bg-black hover:text-white';
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick, ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const Input = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${className}`}
      {...props}
    />
  );
};

const BookingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [branchRes, serviceRes, barberRes] = await Promise.all([
          fetch('https://barber-appointment-backend.vercel.app/api/branches').then(r => r.json()),
          fetch('https://barber-appointment-backend.vercel.app/api/services').then(r => r.json()),
          fetch('https://barber-appointment-backend.vercel.app/api/barbers').then(r => r.json()),
        ]);
        setBranches(branchRes);
        setServices(serviceRes);
        setBarbers(barberRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to load data. Please try again.');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const generateTimeSlots = useCallback((openingHours) => {
    const [open, close] = openingHours.split(' - ');
    const [openHour, openMin] = open.split(':').map(Number);
    const [closeHour, closeMin] = close.split(':').map(Number);
    const slots = [];
    let current = openHour * 60 + openMin;
    const end = closeHour * 60 + closeMin;

    while (current < end) {
      const hour = Math.floor(current / 60).toString().padStart(2, '0');
      const minute = (current % 60).toString().padStart(2, '0');
      slots.push(`${hour}:${minute}`);
      current += 30;
    }
    return slots;
  }, []);

  const selectedBranchData = useMemo(() => 
    branches.find(b => b._id === selectedBranch), 
    [branches, selectedBranch]
  );
  
  const timeSlots = useMemo(() => 
    selectedBranchData ? generateTimeSlots(selectedBranchData.openingHours) : [], 
    [selectedBranchData, generateTimeSlots]
  );
  
  const branchBarbers = useMemo(() => 
    selectedBranch ? barbers.filter(b => b.branch?._id === selectedBranch) : [], 
    [selectedBranch, barbers]
  );

  const totalPrice = useMemo(() => 
    selectedServices.reduce((sum, id) => {
      const service = services.find(s => s._id === id);
      return sum + (service ? parseFloat(service.price.replace('£', '')) : 0);
    }, 0),
    [selectedServices, services]
  );

  const handleServiceToggle = useCallback((id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNext = async () => {
    if (step === 1 && !selectedBranch) return alert('Please select a branch.');
    if (step === 2 && selectedServices.length === 0) return alert('Please select at least one service.');
    if (step === 3 && !selectedBarber) return alert('Please select a barber.');
    if (step === 4 && (!selectedDate || !selectedTime)) return alert('Please select date and time.');
    if (step === 5 && (!userDetails.fullName || !userDetails.email || !userDetails.phone)) return alert('Please fill all details.');

    if (step === 5) {
      setLoading(true);
      try {
        const selectedServicesData = selectedServices.map(id => {
          const service = services.find(s => s._id === id);
          return {
            serviceRef: id,
            name: service.name,
            price: service.price
          };
        });

        const bookingData = {
          customerName: userDetails.fullName,
          email: userDetails.email,
          phone: userDetails.phone,
          date: `${selectedDate}T${selectedTime}:00`,
          selectedServices: selectedServicesData,
          barber: barbers.find(b => b._id === selectedBarber)?.name,
          branch: selectedBranch
        };

        const response = await fetch('https://barber-appointment-backend.vercel.app/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData)
        });

        const data = await response.json();
        setBookingReference(data._id || `BK${Date.now()}`);
        setBookingComplete(true);
      } catch (error) {
        console.error('Booking failed:', error);
        alert('Booking failed. Please try again.');
      } finally {
        setLoading(false);
      }
      return;
    }
    setStep(prev => prev + 1);
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedBranch('');
    setSelectedServices([]);
    setSelectedBarber('');
    setSelectedDate('');
    setSelectedTime('');
    setUserDetails({ fullName: '', email: '', phone: '' });
    setBookingComplete(false);
    setBookingReference('');
  };

  

  const today = new Date().toISOString().split('T')[0];

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex items-center justify-center p-4">
        <div className="text-center">
          <Scissors className="w-12 h-12 text-[#D4AF37] mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-6 sm:p-12 text-center border-2 border-[#D4AF37]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black mb-4">Congratulations!</h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6">Your appointment has been successfully booked</p>
          
          <div className="bg-gray-50 p-4 sm:p-6 rounded-xl mb-8 text-left">
            <p className="text-sm text-gray-500 mb-4">Booking Reference: <span className="font-bold text-black">{bookingReference}</span></p>
            <div className="space-y-2 text-sm sm:text-base">
              <p><strong>Branch:</strong> {branches.find(b => b._id === selectedBranch)?.name}</p>
              <p><strong>Barber:</strong> {barbers.find(b => b._id === selectedBarber)?.name}</p>
              <p><strong>Services:</strong> {selectedServices.map(id => services.find(s => s._id === id)?.name).join(', ')}</p>
              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Total:</strong> <span className="text-[#D4AF37] font-black">£{totalPrice.toFixed(2)}</span></p>
            </div>
          </div>

          <p className="text-gray-600 mb-8 text-sm sm:text-base">A confirmation email has been sent to <strong>{userDetails.email}</strong></p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/"  className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </NavLink>
            <Button onClick={resetBooking} className="w-full sm:w-auto">
              <CalendarPlus className="w-4 h-4 mr-2" />
              Book Another
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <Scissors className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black uppercase tracking-tight mb-2 sm:mb-4">
            Book Your Appointment
          </h1>
          <p className="text-base sm:text-lg text-gray-600">Follow the steps to schedule your visit</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8 sm:mb-12 max-w-3xl mx-auto overflow-x-auto pb-2">
          {['Branch', 'Services', 'Barber', 'Date & Time', 'Details'].map((label, i) => (
            <div key={i} className="text-center flex-1 min-w-[60px] sm:min-w-0">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold transition ${
                step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-[#D4AF37] text-black' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} /> : i + 1}
              </div>
              <p className="text-xs font-semibold text-gray-700 hidden sm:block">{label}</p>
              <p className="text-xs font-semibold text-gray-700 sm:hidden">{label.split(' ')[0]}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        {step === 1 && (
          <Card className="p-4 sm:p-8 border-2 border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Select a Branch</h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {branches.map(branch => (
                <Card
                  key={branch._id}
                  className={`p-4 sm:p-5 cursor-pointer border-2 rounded-xl transition ${
                    selectedBranch === branch._id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 hover:border-[#D4AF37]'
                  }`}
                  onClick={() => {
                    setSelectedBranch(branch._id);
                    setSelectedBarber('');
                  }}
                >
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-sm sm:text-base">{branch.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{branch.address}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{branch.city}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-4 sm:p-8 border-2 border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Select Services</h2>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {services.map(service => (
                <Card
                  key={service._id}
                  className={`p-4 sm:p-5 flex gap-3 border-2 rounded-xl cursor-pointer transition ${
                    selectedServices.includes(service._id) ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 hover:border-[#D4AF37]'
                  }`}
                  onClick={() => handleServiceToggle(service._id)}
                >
                  <div className={`w-5 h-5 mt-1 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                    selectedServices.includes(service._id) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-400'
                  }`}>
                    {selectedServices.includes(service._id) && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm sm:text-base">{service.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{service.duration}</p>
                    <p className="text-base sm:text-lg font-black text-[#D4AF37] mt-1">{service.price}</p>
                  </div>
                </Card>
              ))}
            </div>
            <div className="pt-4 border-t-2">
              <p className="text-lg sm:text-xl font-black">Total: <span className="text-[#D4AF37]">£{totalPrice.toFixed(2)}</span></p>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-4 sm:p-8 border-2 border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Select a Barber</h2>
            {branchBarbers.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No barbers available.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                {branchBarbers.map(barber => (
                  <Card
                    key={barber._id}
                    className={`p-4 sm:p-5 cursor-pointer border-2 rounded-xl transition ${
                      selectedBarber === barber._id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 hover:border-[#D4AF37]'
                    }`}
                    onClick={() => setSelectedBarber(barber._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedBarber === barber._id ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-400'
                      }`}>
                        {selectedBarber === barber._id && <div className="w-2 h-2 bg-black rounded-full"></div>}
                      </div>
                      <div>
                        <p className="font-bold text-sm sm:text-base">{barber.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{barber.experienceYears} years experience</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {step === 4 && (
          <Card className="p-4 sm:p-8 border-2 border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Select Date & Time</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={today} />
              </div>
              {selectedDate && (
                <div>
                  <h3 className="font-bold mb-4 text-sm sm:text-base">Available Times</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="text-sm sm:text-base"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {step === 5 && (
          <Card className="p-4 sm:p-8 border-2 border-gray-100">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Your Details</h2>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <Input name="fullName" value={userDetails.fullName} onChange={handleInputChange} placeholder="Full Name" />
              <Input name="email" type="email" value={userDetails.email} onChange={handleInputChange} placeholder="Email" />
              <Input name="phone" value={userDetails.phone} onChange={handleInputChange} placeholder="Phone" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Confirm Booking</h2>
            <div className="bg-gray-50 p-4 sm:p-6 rounded-xl space-y-2 sm:space-y-3 text-sm sm:text-base">
              <p><strong>Branch:</strong> {branches.find(b => b._id === selectedBranch)?.name}</p>
              <p><strong>Barber:</strong> {barbers.find(b => b._id === selectedBarber)?.name}</p>
              <p><strong>Services:</strong> {selectedServices.map(id => services.find(s => s._id === id)?.name).join(', ')}</p>
              <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Total:</strong> <span className="text-[#D4AF37] font-black">£{totalPrice.toFixed(2)}</span></p>
            </div>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)} className="w-full sm:w-auto">
              Previous
            </Button>
          )}
          <Button onClick={handleNext} disabled={loading} className="w-full sm:w-auto sm:ml-auto">
            {loading ? 'Saving...' : (step === 5 ? 'Confirm Booking' : 'Next')} 
            {!loading && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;