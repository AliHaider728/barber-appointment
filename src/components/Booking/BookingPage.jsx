import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Calendar, Clock, User, ChevronRight, Scissors } from 'lucide-react';

// Reusable Components
const Button = ({ children, className = '', variant = 'default', onClick, ...props }) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-bold transition-all';
  const variantStyles = variant === 'outline' 
    ? 'border-2 bg-white hover:bg-gray-50 text-black' 
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
      className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${className}`}
      {...props}
    />
  );
};

const BookingPage = () => {
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

  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const [branchRes, serviceRes, barberRes] = await Promise.all([
          axios.get('http://localhost:5000/api/branches'),
          axios.get('http://localhost:5000/api/services'),
          axios.get('http://localhost:5000/api/barbers'),
        ]);
        setBranches(branchRes.data);
        setServices(serviceRes.data);
        setBarbers(barberRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        alert('Failed to load data. Please try again.');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const generateTimeSlots = (openingHours) => {
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
  };

  const selectedBranchData = branches.find(b => b._id === selectedBranch);
  const timeSlots = selectedBranchData ? generateTimeSlots(selectedBranchData.openingHours) : [];
  const branchBarbers = selectedBranch ? barbers.filter(b => b.branch?._id === selectedBranch) : [];

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = services.find(s => s._id === id);
    return sum + (service ? parseFloat(service.price.replace('£', '')) : 0);
  }, 0);

  const handleServiceToggle = (id) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (step === 1 && !selectedBranch) return alert('Please select a branch.');
    if (step === 2 && selectedServices.length === 0) return alert('Please select at least one service.');
    if (step === 3 && !selectedBarber) return alert('Please select a barber.');
    if (step === 4 && (!selectedDate || !selectedTime)) return alert('Please select date and time.');
    if (step === 5 && (!userDetails.fullName || !userDetails.email || !userDetails.phone)) return alert('Please fill all details.');

    if (step === 5) {
      setLoading(true);
      try {
        // Build selected services array with name & price
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

        await axios.post('http://localhost:5000/api/appointments', bookingData);
        
        alert('Booking confirmed!');
        // Reset
        setStep(1);
        setSelectedBranch('');
        setSelectedServices([]);
        setSelectedBarber('');
        setSelectedDate('');
        setSelectedTime('');
        setUserDetails({ fullName: '', email: '', phone: '' });
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

  const today = new Date().toISOString().split('T')[0];

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#faf7f2] via-[#f5f1ea] to-[#faf7f2] min-h-screen">
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Scissors className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-5xl font-black text-black uppercase tracking-tight mb-4">
            Book Your Appointment
          </h1>
          <p className="text-lg text-gray-600">Follow the steps to schedule your visit</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-12 max-w-3xl mx-auto">
          {['Branch', 'Services', 'Barber', 'Date & Time', 'Details'].map((label, i) => (
            <div key={i} className="text-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold transition ${
                step > i + 1 ? 'bg-[#D4AF37] text-black' : step === i + 1 ? 'bg-[#D4AF37] text-black' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > i + 1 ? 'Check' : i + 1}
              </div>
              <p className="text-xs font-semibold text-gray-700">{label}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        {step === 1 && (
          <Card className="p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Select a Branch</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {branches.map(branch => (
                <Card
                  key={branch._id}
                  className={`p-5 cursor-pointer border-2 rounded-xl transition ${
                    selectedBranch === branch._id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 hover:border-[#D4AF37]'
                  }`}
                  onClick={() => {
                    setSelectedBranch(branch._id);
                    setSelectedBarber('');
                  }}
                >
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-[#D4AF37] mt-1" />
                    <div>
                      <p className="font-bold">{branch.name}</p>
                      <p className="text-sm text-gray-600">{branch.address}</p>
                      <p className="text-sm text-gray-500">{branch.city}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Select Services</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {services.map(service => (
                <Card
                  key={service._id}
                  className={`p-5 flex gap-3 border-2 rounded-xl cursor-pointer transition ${
                    selectedServices.includes(service._id) ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 hover:border-[#D4AF37]'
                  }`}
                  onClick={() => handleServiceToggle(service._id)}
                >
                  <div className={`w-5 h-5 mt-1 border-2 rounded flex items-center justify-center ${
                    selectedServices.includes(service._id) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-400'
                  }`}>
                    {selectedServices.includes(service._id) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-bold">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.duration}</p>
                    <p className="text-lg font-black text-[#D4AF37] mt-1">{service.price}</p>
                  </div>
                </Card>
              ))}
            </div>
            <div className="pt-4 border-t-2">
              <p className="text-xl font-black">Total: <span className="text-[#D4AF37]">£{totalPrice.toFixed(2)}</span></p>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card className="p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Select a Barber</h2>
            {branchBarbers.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No barbers available.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {branchBarbers.map(barber => (
                  <Card
                    key={barber._id}
                    className={`p-5 cursor-pointer border-2 rounded-xl transition ${
                      selectedBarber === barber._id ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 hover:border-[#D4AF37]'
                    }`}
                    onClick={() => setSelectedBarber(barber._id)}
                  >
                    <div className="flex items-center gap-3">
                      <input type="radio" checked={selectedBarber === barber._id} className="w-5 h-5 accent-[#D4AF37]" readOnly />
                      <div>
                        <p className="font-bold">{barber.name}</p>
                        <p className="text-sm text-gray-600">{barber.experienceYears} years experience</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        )}

        {step === 4 && (
          <Card className="p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Select Date & Time</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#D4AF37]" />
                <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={today} />
              </div>
              {selectedDate && (
                <div>
                  <h3 className="font-bold mb-4">Available Times</h3>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {timeSlots.map(time => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
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

        {step === 5 && (
          <Card className="p-8 border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Your Details</h2>
            <div className="space-y-4 mb-8">
              <Input name="fullName" value={userDetails.fullName} onChange={handleInputChange} placeholder="Full Name" />
              <Input name="email" type="email" value={userDetails.email} onChange={handleInputChange} placeholder="Email" />
              <Input name="phone" value={userDetails.phone} onChange={handleInputChange} placeholder="Phone" />
            </div>

            <h2 className="text-2xl font-bold mb-6">Confirm Booking</h2>
            <div className="bg-gray-50 p-6 rounded-xl space-y-3">
              <p><strong>Branch:</strong> {branches.find(b => b._id === selectedBranch)?.name}</p>
              <p><strong>Barber:</strong> {barbers.find(b => b._id === selectedBarber)?.name}</p>
              <p><strong>Services:</strong> {selectedServices.map(id => services.find(s => s._id === id)?.name).join(', ')}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Time:</strong> {selectedTime}</p>
              <p><strong>Total:</strong> <span className="text-[#D4AF37] font-black">£{totalPrice.toFixed(2)}</span></p>
            </div>
          </Card>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(s => s - 1)}>Previous</Button>
          )}
          <Button onClick={handleNext} disabled={loading}>
            {loading ? 'Saving...' : (step === 5 ? 'Confirm Booking' : 'Next')} <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;