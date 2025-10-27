import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, User, CheckCircle, ChevronRight, Scissors } from 'lucide-react';

// Button Component
const Button = ({ children, className = '', variant = 'default', onClick, ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-semibold transition-all';
  const variantStyles = variant === 'outline' 
    ? 'border-2 bg-white hover:bg-gray-50' 
    : 'bg-[#D4AF37] text-black hover:bg-black hover:text-white';
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Component
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

// Input Component
const Input = ({ className = '', ...props }) => {
  return (
    <input 
      className={`w-full px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${className}`}
      {...props}
    />
  );
};

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  // Hardcoded data (for testing)
  const branches = [
    { _id: "1", name: "Central London", city: "London", address: "18 Baker Street, Central London, W1U 3EZ", phone: "+44 20 7946 0958", openingHours: "09:00 - 19:00", coordinates: { lat: 51.5173, lng: -0.1567 } },
    { _id: "2", name: "Deansgate", city: "Manchester", address: "12 Deansgate, Manchester, M3 4EN", phone: "+44 161 832 4444", openingHours: "09:30 - 18:30", coordinates: { lat: 53.4808, lng: -2.2426 } },
    { _id: "3", name: "City Centre", city: "Birmingham", address: "44 High Street, Birmingham, B2 5PR", phone: "+44 121 555 0123", openingHours: "10:00 - 19:00", coordinates: { lat: 52.5099, lng: -1.8852 } },
    { _id: "4", name: "Headingley", city: "Leeds", address: "7 Otley Road, Headingley, LS6 3DG", phone: "+44 113 350 3344", openingHours: "09:00 - 17:00", coordinates: { lat: 53.8235, lng: -1.5547 } },
    { _id: "5", name: "Merchant City", city: "Glasgow", address: "25 Ingram Street, Merchant City, G1 1HA", phone: "+44 141 221 0000", openingHours: "09:30 - 18:00", coordinates: { lat: 55.8642, lng: -4.2518 } },
  ];

  const services = [
    { _id: "s1", name: "Men's Haircut", duration: "30 minutes", price: "£25" },
    { _id: "s2", name: "Beard Trim", duration: "20 minutes", price: "£15" },
    { _id: "s3", name: "Hair Color", duration: "45 minutes", price: "£40" },
    { _id: "s4", name: "Facial & Grooming", duration: "40 minutes", price: "£35" },
    { _id: "s5", name: "Kids Haircut", duration: "25 minutes", price: "£20" },
    { _id: "s6", name: "Head Massage", duration: "30 minutes", price: "£30" },
    { _id: "s7", name: "Hair Wash", duration: "10 minutes", price: "£10" },
    { _id: "s8", name: "Shave", duration: "20 minutes", price: "£18" },
    { _id: "s9", name: "Hair Styling", duration: "25 minutes", price: "£22" },
    { _id: "s10", name: "Waxing", duration: "15 minutes", price: "£12" },
  ];

  const barbers = [
    { _id: "1", name: "James Cole", experience_years: 8, specialties: ["Haircuts", "Styling"], branch: "1" },
    { _id: "2", name: "Ryan Smith", experience_years: 5, specialties: ["Beard Trim", "Shave"], branch: "1" },
    { _id: "3", name: "Omar Ali", experience_years: 6, specialties: ["Hair Color", "Grooming"], branch: "1" },
    { _id: "4", name: "Michael Brown", experience_years: 4, specialties: ["Haircuts", "Styling"], branch: "2" },
    { _id: "5", name: "Liam Johnson", experience_years: 4, specialties: ["Beard Trim", "Shave"], branch: "2" },
    { _id: "6", name: "Noor Patel", experience_years: 5, specialties: ["Hair Color", "Grooming"], branch: "2" },
    { _id: "7", name: "Ethan White", experience_years: 6, specialties: ["Haircuts", "Styling"], branch: "3" },
    { _id: "8", name: "Aiden Clarke", experience_years: 3, specialties: ["Beard Trim", "Shave"], branch: "3" },
    { _id: "9", name: "Zara Khan", experience_years: 5, specialties: ["Hair Color", "Grooming"], branch: "3" },
    { _id: "10", name: "Oliver Green", experience_years: 5, specialties: ["Haircuts", "Styling"], branch: "4" },
    { _id: "11", name: "Luke Martin", experience_years: 4, specialties: ["Beard Trim", "Shave"], branch: "4" },
    { _id: "12", name: "Priya Singh", experience_years: 6, specialties: ["Hair Color", "Grooming"], branch: "4" },
    { _id: "13", name: "Callum Ross", experience_years: 7, specialties: ["Haircuts", "Styling"], branch: "5" },
    { _id: "14", name: "Sean MacLeod", experience_years: 5, specialties: ["Beard Trim", "Shave"], branch: "5" },
    { _id: "15", name: "Hamza Ahmed", experience_years: 4, specialties: ["Hair Color", "Grooming"], branch: "5" },
  ];

  // Generate time slots based on branch opening hours
  const generateTimeSlots = (openingHours) => {
    const [open, close] = openingHours.split(' - ');
    const start = parseInt(open.replace(':', ''), 10);
    const end = parseInt(close.replace(':', ''), 10);
    const slots = [];
    for (let hour = start; hour < end; hour += 100) {
      slots.push(`${Math.floor(hour / 100)}:${(hour % 100) === 0 ? '00' : '30'}`);
      if ((hour % 100) === 0) slots.push(`${Math.floor(hour / 100)}:30`);
    }
    return slots.filter(slot => parseInt(slot.replace(':', ''), 10) <= end);
  };

  const selectedBranchData = branches.find(b => b._id === selectedBranch);
  const timeSlots = selectedBranchData ? generateTimeSlots(selectedBranchData.openingHours) : [];

  // Calculate total price of selected services
  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = services.find(s => s._id === serviceId);
    if (service && service.price) {
      const price = parseFloat(service.price.replace('£', ''));
      return total + price;
    }
    return total;
  }, 0);

  // Filter barbers by selected branch
  const branchBarbers = selectedBranch ? barbers.filter(b => b.branch === selectedBranch) : [];

  // Handle service selection (toggle)
  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  // Validate and proceed to next step
  const handleNext = () => {
    if (step === 1 && !selectedBranch) {
      alert('Please select a branch.');
      return;
    }
    if (step === 2 && selectedServices.length === 0) {
      alert('Please select at least one service.');
      return;
    }
    if (step === 3 && !selectedBarber) {
      alert('Please select a barber.');
      return;
    }
    if (step === 4 && (!selectedDate || !selectedTime)) {
      alert('Please select a date and time.');
      return;
    }
    if (step === 5 && (!userDetails.fullName || !userDetails.email || !userDetails.phone)) {
      alert('Please fill in all details.');
      return;
    }
    if (step === 5) {
      console.log({
        branch: branches.find(b => b._id === selectedBranch)?.name,
        barber: barbers.find(b => b._id === selectedBarber)?.name,
        services: selectedServices.map(id => services.find(s => s._id === id)?.name),
        date: selectedDate,
        time: selectedTime,
        totalPrice: `£${totalPrice.toFixed(2)}`,
        customerDetails: userDetails,
      });
      alert('Booking confirmed! Details logged to console.');
      return;
    }
    setStep(prev => prev + 1);
  };

  // Simulate loading state
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [step]);

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <Scissors className="w-12 h-12 text-[#D4AF37] mx-auto" />
          </div>
          <h1 className="text-5xl font-black text-black uppercase tracking-tight mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600">Follow the steps to schedule your visit</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Step Indicator */}
            <div className="flex justify-between mb-12 max-w-3xl mx-auto">
              {['Branch', 'Services', 'Barber', 'Date & Time', 'Details'].map((label, index) => (
                <div key={index} className="text-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold transition ${
                      step > index + 1
                        ? 'bg-[#D4AF37] text-black'
                        : step === index + 1
                        ? 'bg-[#D4AF37] text-black'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > index + 1 ? '✓' : index + 1}
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                </div>
              ))}
            </div>

            {/* Step 1: Select Branch */}
            {step === 1 && (
              <Card className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight">Select a Branch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branches.map(branch => (
                    <Card
                      key={branch._id}
                      className={`p-5 cursor-pointer transition border-2 rounded-xl ${
                        selectedBranch === branch._id
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                          : 'border-gray-200 hover:border-[#D4AF37]'
                      }`}
                      onClick={() => setSelectedBranch(branch._id)}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-lg font-bold text-black">{branch.name}</p>
                          <p className="text-sm text-gray-700">{branch.address}</p>
                          <p className="text-sm text-gray-500">{branch.city}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Step 2: Select Services */}
            {step === 2 && (
              <Card className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight">
                  Select Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {services.map((service, index) => (
                    <Card
                      key={service._id}
                      className={`p-5 flex items-start gap-3 border-2 rounded-xl transition cursor-pointer ${
                        selectedServices.includes(service._id)
                          ? "border-[#D4AF37] bg-[#D4AF37]/5"
                          : "border-gray-200 hover:border-[#D4AF37]"
                      }`}
                      onClick={() => handleServiceToggle(service._id)}
                    >
                      <div 
                        className={`w-5 h-5 mt-1 border-2 rounded flex items-center justify-center pointer-events-none ${
                          selectedServices.includes(service._id) 
                            ? 'bg-[#D4AF37] border-[#D4AF37]' 
                            : 'border-gray-400'
                        }`}
                      >
                        {selectedServices.includes(service._id) && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 pointer-events-none">
                        <p className="text-lg font-bold text-black">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.duration}</p>
                        <p className="text-lg font-black text-[#D4AF37] mt-1">
                          {service.price}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="pt-4 border-t-2 border-gray-100">
                  <p className="text-xl font-black text-black">
                    Total: <span className="text-[#D4AF37]">£{totalPrice.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedServices.length} service(s) selected
                  </p>
                </div>
              </Card>
            )}

            {/* Step 3: Select Barber */}
            {step === 3 && (
              <Card className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight">Select a Barber</h2>
                {branchBarbers.length === 0 ? (
                  <p className="text-gray-600">No barbers available at this branch.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {branchBarbers.map(barber => (
                      <Card
                        key={barber._id}
                        className={`p-5 cursor-pointer transition border-2 rounded-xl ${
                          selectedBarber === barber._id
                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                            : 'border-gray-200 hover:border-[#D4AF37]'
                        }`}
                        onClick={() => setSelectedBarber(barber._id)}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="barber"
                            checked={selectedBarber === barber._id}
                            onChange={() => setSelectedBarber(barber._id)}
                            className="w-5 h-5 accent-[#D4AF37]"
                          />
                          <div>
                            <p className="text-lg font-bold text-black">{barber.name}</p>
                            <p className="text-sm text-gray-600">{barber.experience_years} years experience</p>
                            <p className="text-sm text-gray-600">Specialties: {barber.specialties.join(', ')}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Step 4: Select Date and Time */}
            {step === 4 && (
              <Card className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight">Select Date and Time</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={today}
                      className="w-full max-w-xs border-2 border-gray-200 focus:border-[#D4AF37] rounded-lg"
                    />
                  </div>
                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-bold text-black mb-4">Available Times</h3>
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {timeSlots.map(time => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            className={`w-full font-semibold border-2 rounded-lg transition ${
                              selectedTime === time
                                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                                : 'bg-white border-gray-200 hover:border-[#D4AF37] text-black'
                            }`}
                            onClick={() => setSelectedTime(time)}
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

            {/* Step 5: Your Details and Confirmation */}
            {step === 5 && (
              <Card className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight">Your Details</h2>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Full Name</label>
                    <Input
                      name="fullName"
                      value={userDetails.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="border-2 border-gray-200 focus:border-[#D4AF37] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="border-2 border-gray-200 focus:border-[#D4AF37] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-gray-700 mb-2 block">Phone Number</label>
                    <Input
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="border-2 border-gray-200 focus:border-[#D4AF37] rounded-lg"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight">Confirm Booking</h2>
                <div className="space-y-4 bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-600">Branch</p>
                      <p className="text-base text-black">{branches.find(b => b._id === selectedBranch)?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-600">Barber</p>
                      <p className="text-base text-black">{barbers.find(b => b._id === selectedBarber)?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-600">Services</p>
                      <p className="text-base text-black">
                        {selectedServices.map(id => services.find(s => s._id === id)?.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-600">Date</p>
                      <p className="text-base text-black">{selectedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-gray-600">Time</p>
                      <p className="text-base text-black">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-gray-200">
                    <p className="text-xl font-black text-black">
                      Total: <span className="text-[#D4AF37]">£{totalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  className="border-2 border-gray-300 text-black font-semibold hover:border-[#D4AF37] rounded-lg px-6"
                  onClick={() => setStep(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
              <Button
                className="bg-[#D4AF37] text-black font-bold hover:bg-black hover:text-white transition rounded-lg px-6 ml-auto"
                onClick={handleNext}
              >
                {step === 5 ? 'Confirm Booking' : 'Next'} <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default BookingPage;