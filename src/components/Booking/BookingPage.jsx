import React, { useState, useEffect, useMemo } from 'react';
import { Scissors, Check, Home, CalendarPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressSteps from  "./ProgressSteps.jsx";
import BookingSummary from  "./BookingSummary.jsx";
import StepContent from  "./StepContent.jsx";
import StepNavigation from  "./StepNavigation.jsx";

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>{children}</div>
);

const Button = ({ children, className = '', variant = 'default', onClick, disabled, ...props }) => {
  const base = 'px-4 py-2 rounded-lg font-bold flex items-center justify-center transition-all';
  const styles = variant === 'outline'
    ? 'border-2 bg-white hover:bg-gray-50 text-black'
    : 'bg-[#D4AF37] text-black hover:bg-black hover:text-white';
  return <button className={`${base} ${styles} ${className}`} onClick={onClick} disabled={disabled} {...props}>{children}</button>;
};

const parseTimeOnDate = (t, dateStr) => {
  const [h, m] = t.split(':').map(Number);
  const d = new Date(dateStr);
  d.setHours(h, m, 0, 0);
  return d;
};

const formatTime = (d) => d.toTimeString().slice(0, 5);
const addMinutes = (date, mins) => new Date(date.getTime() + mins * 60000);

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
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [branches, setBranches] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [branchBarbers, setBranchBarbers] = useState([]);
  const [barberSpecialties, setBarberSpecialties] = useState([]);
  const [barberShift, setBarberShift] = useState(null);
  const [shiftLoading, setShiftLoading] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);
  const [barberLeaves, setBarberLeaves] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    if (isLoggedIn && step === 4) {
      const token = localStorage.getItem('auth-token');
      fetch('https://barber-appointment-backend.vercel.app/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch user data');
          return res.json();
        })
        .then(data => {
          setUserDetails({
            fullName: data.user.fullName || '',
            email: data.user.email || '',
            phone: data.user.phone || ''
          });
        })
        .catch(err => {
          console.error('User fetch error:', err);
          alert('Failed to load user details. Please try again.');
        });
    }
  }, [isLoggedIn, step]);

  useEffect(() => {
    const fetchAll = async () => {  
      try {  
        setFetching(true);  
        const [bRes, sRes, barbRes] = await Promise.all([  
          fetch('https://barber-appointment-backend.vercel.app/api/branches'),  
          fetch('https://barber-appointment-backend.vercel.app/api/services'),  
          fetch('https://barber-appointment-backend.vercel.app/api/barbers')  
        ]);  

        const parseAndValidate = async (res) => {  
          if (!res.ok) {  
            throw new Error(`HTTP error! status: ${res.status}`);  
          }  
          const data = await res.json();  
          return Array.isArray(data) ? data : []; 
        };  

        const b = await parseAndValidate(bRes);  
        const s = await parseAndValidate(sRes);  
        const barb = await parseAndValidate(barbRes);  

        setBranches(b);  
        setServices(s);  
        setBarbers(barb);  
      } catch (err) {  
        console.error('Fetch error:', err);  
        alert('Failed to load data. Please try again.');  
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

  //  UPDATED: Fetch APPROVED leaves for the selected barber and date
  useEffect(() => {
    if (selectedBarber && selectedDate) {
      fetch(`https://barber-appointment-backend.vercel.app/api/leaves/barber/${selectedBarber}/date/${selectedDate}`)
        .then(r => {
          if (!r.ok) throw new Error('No leaves');
          return r.json();
        })
        .then(data => {
          //  CRITICAL: Backend already filters only approved leaves
          // But we double-check here for safety
          const approvedLeaves = Array.isArray(data) 
            ? data.filter(leave => leave.status === 'approved')
            : [];
          setBarberLeaves(approvedLeaves);
        })
        .catch(() => setBarberLeaves([]));
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

  //  UPDATED: timeSlots calculation now properly filters APPROVED leaves
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
      // Skip past times for today
      if (isToday && current < now) {
        current = addMinutes(current, totalMinutes);
        continue;
      }

      const slotEnd = addMinutes(current, totalMinutes);

      // Check for existing booking conflicts
      const hasBookingConflict = existingBookings.some(booking => {
        const bookingStart = new Date(booking.date);
        const bookingEnd = addMinutes(bookingStart, booking.duration);
        return (current < bookingEnd && slotEnd > bookingStart);
      });

      //  UPDATED: Check for APPROVED leave conflicts
      const hasLeaveConflict = barberLeaves.some(leave => {
        // Double-check status (backend should already filter, but safety first)
        if (leave.status !== 'approved') return false;
        
        const leaveStart = new Date(leave.startDate);
        const leaveEnd = new Date(leave.endDate);
        
        // Check if slot overlaps with leave period
        return (current < leaveEnd && slotEnd > leaveStart);
      });

      //  Only add slot if NO conflicts (bookings OR leaves)
      if (!hasBookingConflict && !hasLeaveConflict) {
        slots.push({
          start: formatTime(current),
          end: formatTime(slotEnd),
          available: true
        });
      }

      current = addMinutes(current, totalMinutes);
    }

    return slots;
  }, [selectedDate, selectedBarber, totalMinutes, barberShift, existingBookings, barberLeaves]);

  const handleServiceToggle = id => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

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
      if (!validateStep4()) {
        alert('Please fill in all details correctly');
        return;
      }

      if (!paymentMethod) {
        alert('Please select a payment method');
        return;
      }

      if (paymentMethod === 'card') {
        return;
      }

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
      const token = localStorage.getItem('auth-token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

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
        headers,
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Booking failed');
      } 
      const data = await res.json();
      setBookingRef(data._id);
      setBookingComplete(true);
    } catch (err) {
      console.error('Booking error:', err);
      alert('Booking failed: ' + (err.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };
  
  const today = new Date().toISOString().split('T')[0];

  const selectedBranchData = Array.isArray(branches) ? branches.find(b => b._id === selectedBranch) : null;    
  const selectedBarberData = barbers.find(b => b._id === selectedBarber);
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
            <ProgressSteps step={step} />

            <StepContent
              step={step}
              branches={branches}
              selectedBranch={selectedBranch}
              setSelectedBranch={setSelectedBranch}
              gender={gender}
              setGender={setGender}
              branchBarbers={branchBarbers}
              selectedBarber={selectedBarber}
              setSelectedBarber={setSelectedBarber}
              barberSpecialties={barberSpecialties}
              selectedServices={selectedServices}
              handleServiceToggle={handleServiceToggle}
              totalPrice={totalPrice}
              totalMinutes={totalMinutes}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              shiftLoading={shiftLoading}
              barberShift={barberShift}
              timeSlots={timeSlots}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              isLoggedIn={isLoggedIn}
              userDetails={userDetails}
              errors={errors}
              handleInputChange={handleInputChange}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              loading={loading}
              handleNext={handleNext}
              today={today}
              setBookingRef={setBookingRef}
              setBookingComplete={setBookingComplete}
            />

            <StepNavigation step={step} loading={loading} handleNext={handleNext} setStep={setStep} />
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              selectedBranchData={selectedBranchData}
              selectedBarberData={selectedBarberData}
              selectedServicesData={selectedServicesData}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              selectedTimeSlot={selectedTimeSlot}
              totalPrice={totalPrice}
              totalMinutes={totalMinutes}
            />
          </div>    
        </div>
      </div>
    </div>
  );
};

export default BookingPage;