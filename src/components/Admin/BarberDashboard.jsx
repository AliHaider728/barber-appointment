import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import BarberHeader from "./BarberComponent/BarberHeader.jsx";
import BarberSidebar from './BarberComponent/BarberSidebar.jsx';
import OverviewTab from './BarberComponent/OverviewTab.jsx';
import AppointmentsTab from './BarberComponent/AppointmentsTab.jsx';
import ScheduleTab from './BarberComponent/ScheduleTab.jsx';
import PaymentsTab from './BarberComponent/PaymentsTab.jsx';
import LeavesTab from './BarberComponent/LeavesTab.jsx';
import ProfileTab from './BarberComponent/ProfileTab.jsx';
import ServicesTab from './BarberComponent/ServicesTab.jsx';
import ErrorState from './BarberComponent/ErrorState.jsx';
import LoadingState from './BarberComponent/LoadingState.jsx';

const API_BASE = 'https://barber-appointment-backend.vercel.app/api';

function BarberDashboard() {
  const [barberData, setBarberData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingAmount: 0,
    todayAppointments: 0,
    completedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
    date: '',
    reason: ''
  });

  const [shiftForm, setShiftForm] = useState({
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '19:00',
    isOff: false
  });

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  useEffect(() => {
    let mounted = true;

    const initDashboard = async () => {
      if (!mounted) return;

      try {
        await checkAuthAndLoadData();
      } catch (error) {
        console.error('Dashboard init failed:', error);
        if (mounted) {
          setError(error.message);
        }
      }
    };

    initDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      console.log('Starting authentication check...');

      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user-data');

      if (!token || !userData) {
        console.error('No token or user data');
        throw new Error('No valid authentication found');
      }

      const parsedData = JSON.parse(userData);
      const role = localStorage.getItem('user-role');

      if (role !== 'barber') {
        throw new Error('Access denied - not a barber account');
      }

      const barberId = parsedData.barberId;
      if (!barberId) {
        throw new Error('Barber ID not found');
      }

      console.log('Authenticated - Barber ID:', barberId);

      await loadBarberData(barberId, token);
      setAuthChecked(true);

    } catch (error) {
      console.error('Auth failed:', error);
      setError(error.message);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    }
  };

  const loadBarberData = async (barberId, token) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading data for barber:', barberId);

      const headers = { Authorization: `Bearer ${token}` };
      const timeout = 30000; // 30 seconds

      const [barberRes, appointmentsRes, shiftsRes, leavesRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/barbers/${barberId}`, { headers, timeout }),
        axios.get(`${API_BASE}/appointments?barber=${barberId}`, { headers, timeout }),
        axios.get(`${API_BASE}/barber-shifts?barber=${barberId}`, { headers, timeout }),
        axios.get(`${API_BASE}/leaves/barber/me`, { headers, timeout })
      ]);

      if (barberRes.status === 'fulfilled') {
        console.log('  Barber data loaded:', barberRes.value.data.name);
        setBarberData(barberRes.value.data);
      } else {
        console.error('  Failed to load barber:', barberRes.reason.message);
        
        if (barberRes.reason.code === 'ECONNABORTED') {
          throw new Error('Connection timeout - please check your internet and try again');
        }
        
        throw new Error('Failed to load barber profile - please refresh the page');
      }

      if (appointmentsRes.status === 'fulfilled') {
        const appts = appointmentsRes.value.data;
        console.log('  Appointments loaded:', appts.length);
        setAppointments(Array.isArray(appts) ? appts : []);
        calculateStats(Array.isArray(appts) ? appts : []);
      } else {
        console.warn('  Failed to load appointments:', appointmentsRes.reason.message);
        setAppointments([]);
        calculateStats([]);
      }

      if (shiftsRes.status === 'fulfilled') {
        const shiftData = shiftsRes.value.data;
        console.log('  Shifts loaded:', shiftData.length);
        setShifts(Array.isArray(shiftData) ? shiftData : []);
      } else {
        console.warn('  Failed to load shifts:', shiftsRes.reason.message);
        setShifts([]);
      }

      if (leavesRes.status === 'fulfilled') {
        const leaveData = leavesRes.value.data;
        console.log('  Leaves loaded:', leaveData.length);
        setLeaves(Array.isArray(leaveData) ? leaveData : []);
      } else {
        console.warn('  Failed to load leaves:', leavesRes.reason.message);
        setLeaves([]);
      }

    } catch (error) {
      console.error('  Load data error:', error);
      
      if (error.response?.status === 401) {
        setError('Session expired - please login again');
        setTimeout(() => handleLogout(), 2000);
      } else if (error.code === 'ECONNABORTED') {
        setError('Connection timeout - please check your internet and try refreshing');
      } else {
        setError(error.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (appts) => {
    const today = new Date().toDateString();

    let totalEarnings = 0;
    let pendingAmount = 0;
    let todayCount = 0;
    let completedToday = 0;

    appts.forEach(apt => {
      const aptDate = new Date(apt.date).toDateString();
      const price = parseFloat(apt.totalPrice) || 0;

      if (apt.status === 'confirmed' || apt.status === 'completed') {
        totalEarnings += price;
      }

      if (apt.paymentStatus === 'pending') {
        pendingAmount += price;
      }

      if (aptDate === today) {
        todayCount++;
        if (apt.status === 'completed') {
          completedToday++;
        }
      }
    });

    setStats({
      totalEarnings,
      pendingAmount,
      todayAppointments: todayCount,
      completedToday
    });
  };

  const handleLogout = async () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Session expired!');
        handleLogout();
        return;
      }

      await axios.put(
        `${API_BASE}/appointments/${appointmentId}`,
        { status: newStatus },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000 
        }
      );  

      const barberId = JSON.parse(localStorage.getItem('user-data')).barberId;
      await loadBarberData(barberId, token);
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Status update error:', error);
      const errorMsg = error.code === 'ECONNABORTED' 
        ? 'Request timeout - please try again'
        : error.response?.data?.message || error.message;
      alert('Failed to update: ' + errorMsg);
    }
  };
 
  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Session expired!');
        handleLogout();
        return;
      }

      const barberId = JSON.parse(localStorage.getItem('user-data')).barberId;
      await axios.post(
        `${API_BASE}/leaves/barber/me`,
        leaveForm,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        }
      );  

      await loadBarberData(barberId, token);
      setLeaveForm({ date: '', reason: '' });
      alert('Leave applied successfully!');
    } catch (error) {
      console.error('Apply leave error:', error);
      const errorMsg = error.code === 'ECONNABORTED' 
        ? 'Request timeout - please try again'
        : error.response?.data?.message || error.message;
      alert('Failed to apply leave: ' + errorMsg);
    }
  };

  const handleLeaveChange = (e) => {
    setLeaveForm({ ...leaveForm, [e.target.name]: e.target.value });
  };

  const handleShiftChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShiftForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'dayOfWeek' ? parseInt(value) : value)
    }));
  };

  const handleShiftSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Session expired!');
        handleLogout();
        return;
      }

      const barberId = JSON.parse(localStorage.getItem('user-data')).barberId;
      const payload = {
        barber: barberId,
        dayOfWeek: shiftForm.dayOfWeek,
        isOff: shiftForm.isOff
      };

      if (!shiftForm.isOff) {
        payload.startTime = shiftForm.startTime;
        payload.endTime = shiftForm.endTime;
      }

      await axios.post(
        `${API_BASE}/barber-shifts`,
        payload,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        }
      );

      await loadBarberData(barberId, token);
      setShiftForm({ dayOfWeek: 0, startTime: '09:00', endTime: '19:00', isOff: false });
      alert('Shift updated successfully!');
    } catch (error) {
      console.error('Shift update error:', error);
      const errorMsg = error.code === 'ECONNABORTED' 
        ? 'Request timeout - please try again'
        : error.response?.data?.message || error.message;
      alert('Failed to update: ' + errorMsg);
    }
  };

  const handleEditShift = (shift) => {
    setShiftForm({
      dayOfWeek: shift.dayOfWeek,
      startTime: shift.startTime || '09:00',
      endTime: shift.endTime || '19:00',
      isOff: shift.isOff
    });
  };

  const handleDeleteShift = async (shiftId) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) return;
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        alert('Session expired!');
        handleLogout();
        return;
      }

      const barberId = JSON.parse(localStorage.getItem('user-data')).barberId;
      await axios.delete(
        `${API_BASE}/barber-shifts/${shiftId}`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        }
      );

      await loadBarberData(barberId, token);
      alert('Shift deleted successfully!');
    } catch (error) {
      console.error('Shift delete error:', error);
      const errorMsg = error.code === 'ECONNABORTED' 
        ? 'Request timeout - please try again'
        : error.response?.data?.message || error.message;
      alert('Failed to delete: ' + errorMsg);
    }
  };

  if (error && !authChecked) {
    return <ErrorState error={error} navigate={navigate} />;
  }

  if (!authChecked || loading) {
    return <LoadingState authChecked={authChecked} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BarberHeader
        barberData={barberData}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        handleLogout={handleLogout}
      />
      <div className="flex">
        <BarberSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              appointments={appointments}
            />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsTab
              appointments={appointments}
              handleStatusUpdate={handleStatusUpdate}
            />
          )}
          {activeTab === 'schedule' && (
            <ScheduleTab
              shifts={shifts}
              shiftForm={shiftForm}
              daysOfWeek={daysOfWeek}
              handleShiftChange={handleShiftChange}
              handleShiftSubmit={handleShiftSubmit}
              handleEditShift={handleEditShift}
              handleDeleteShift={handleDeleteShift}
            />
          )}
          {activeTab === 'services' && barberData && (
            <ServicesTab barberData={barberData} />
          )}
          {activeTab === 'payments' && (
            <PaymentsTab
              appointments={appointments}
            />
          )}
          {activeTab === 'leaves' && (
            <LeavesTab
              leaves={leaves}
              leaveForm={leaveForm}
              handleLeaveChange={handleLeaveChange}
              handleApplyLeave={handleApplyLeave}
            />
          )}
          {activeTab === 'profile' && barberData && (
            <ProfileTab barberData={barberData} />
          )}
        </main>
      </div>
    </div>
  );
}

export default BarberDashboard;