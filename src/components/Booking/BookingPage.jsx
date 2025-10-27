import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, User, CheckCircle, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';

// Importing data
import branches from '../../data/branches';
import services from '../../data/services';
import barbers from '../../data/barbers';

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

  // Generate time slots (9:00 AM to 6:00 PM, every 30 minutes)
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Calculate total price of selected services
  const totalPrice = selectedServices.reduce((total, serviceId) => {
    const service = services.find(s => s._id === serviceId);
    if (service && service.price) {
      // Convert price string (e.g., "£30") to number for calculation
      const price = parseFloat(service.price.replace('£', ''));
      return total + price;
    }
    return total;
  }, 0);

  // Filter barbers by selected branch
  const branchBarbers = selectedBranch ? barbers.filter(b => b.branch === selectedBranch) : [];

  // Handle service selection (toggle)
  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
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
      // Simulate booking confirmation
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
    <div className="bg-[#faf7f2] min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Book Your Appointment</h1>
        <p className="text-lg text-muted-foreground mb-8">Follow the steps to schedule your visit</p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <>
            {/* Step Indicator */}
            <div className="flex justify-between mb-8">
              {['Branch', 'Services', 'Barber', 'Date & Time', 'Details'].map((label, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      step > index + 1 ? 'bg-primary text-primary-foreground' : step === index + 1 ? 'bg-primary/20 text-primary' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className="text-sm">{label}</p>
                </div>
              ))}
            </div>

            {/* Step 1: Select Branch */}
            {step === 1 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Select a Branch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branches.map(branch => (
                    <Card
                      key={branch._id}
                      className={`p-4 cursor-pointer transition ${selectedBranch === branch._id ? 'border-primary bg-primary/10' : 'border-border'}`}
                      onClick={() => setSelectedBranch(branch._id)}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-label="Location" />
                        <div>
                          <p className="text-lg font-semibold text-foreground">{branch.name}</p>
                          <p className="text-sm text-foreground">{branch.address}</p>
                          <p className="text-sm text-muted-foreground">{branch.city}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {/* Step 2: Select Services */}
            {step === 2 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Select Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map(service => (
                    <Card
                      key={service._id}
                      className={`p-4 flex items-center gap-3 ${selectedServices.includes(service._id) ? 'border-primary bg-primary/10' : 'border-border'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service._id)}
                        onChange={() => handleServiceToggle(service._id)}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="text-lg font-semibold text-foreground">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                        <p className="text-lg font-bold text-[#D4AF37]">{service.price}</p>
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="mt-6">
                  <p className="text-lg font-semibold text-foreground">Total: £{totalPrice.toFixed(2)}</p>
                </div>
              </Card>
            )}

            {/* Step 3: Select Barber */}
            {step === 3 && (
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Select a Barber</h2>
                {branchBarbers.length === 0 ? (
                  <p className="text-muted-foreground">No barbers available at this branch.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {branchBarbers.map(barber => (
                      <Card
                        key={barber._id}
                        className={`p-4 cursor-pointer transition ${selectedBarber === barber._id ? 'border-primary bg-primary/10' : 'border-border'}`}
                        onClick={() => setSelectedBarber(barber._id)}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="barber"
                            checked={selectedBarber === barber._id}
                            onChange={() => setSelectedBarber(barber._id)}
                            className="w-5 h-5"
                          />
                          <div>
                            <p className="text-lg font-semibold text-foreground">{barber.name}</p>
                            <p className="text-sm text-muted-foreground">{barber.experience_years} years experience</p>
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
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Select Date and Time</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0" aria-label="Calendar" />
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={today}
                      className="w-full max-w-xs"
                    />
                  </div>
                  {selectedDate && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Available Times</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {timeSlots.map(time => (
                          <Button
                            key={time}
                            variant={selectedTime === time ? 'default' : 'outline'}
                            className={`w-full ${selectedTime === time ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
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
              <Card className="p-6">
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Details</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">Full Name</label>
                    <Input
                      name="fullName"
                      value={userDetails.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={userDetails.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Phone Number</label>
                    <Input
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-foreground mb-4">Confirm Booking</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-label="Branch" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Branch</p>
                      <p className="text-sm text-foreground">{branches.find(b => b._id === selectedBranch)?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-label="Barber" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Barber</p>
                      <p className="text-sm text-foreground">{barbers.find(b => b._id === selectedBarber)?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-label="Services" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Services</p>
                      <p className="text-sm text-foreground">
                        {selectedServices.map(id => services.find(s => s._id === id)?.name).join(', ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-label="Date" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Date</p>
                      <p className="text-sm text-foreground">{selectedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-label="Time" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Time</p>
                      <p className="text-sm text-foreground">{selectedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-foreground">Total Price</p>
                    <p className="text-sm font-bold text-[#D4AF37]">£{totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-label="Customer Details" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Customer Details</p>
                      <p className="text-sm text-foreground">Name: {userDetails.fullName}</p>
                      <p className="text-sm text-foreground">Email: {userDetails.email}</p>
                      <p className="text-sm text-foreground">Phone: {userDetails.phone}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <Button
                  variant="outline"
                  className="bg-transparent"
                  onClick={() => setStep(prev => prev - 1)}
                >
                  Previous
                </Button>
              )}
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
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