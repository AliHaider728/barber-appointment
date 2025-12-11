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

  // New states for leaves
  const [leaves, setLeaves] = useState([]);
  const [leaveForm, setLeaveForm] = useState({
    date: '',
    reason: ''
  });

  // States for shifts update
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

      // Use custom auth from localStorage (no Supabase)
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
      console.log('  Loading data for barber:', barberId);

      const headers = { Authorization: `Bearer ${token}` };

      // Parallel API calls with error handling
      const [barberRes, appointmentsRes, shiftsRes, leavesRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/barbers/${barberId}`, { headers, timeout: 10000 }),
        axios.get(`${API_BASE}/appointments?barber=${barberId}`, { headers, timeout: 10000 }),
        axios.get(`${API_BASE}/barber-shifts?barber=${barberId}`, { headers, timeout: 10000 }),
        axios.get(`${API_BASE}/leaves/barber/me`, { headers, timeout: 10000 })
      ]);

      // Handle barber data
      if (barberRes.status === 'fulfilled') {
        console.log('Barber data:', barberRes.value.data.name);
        setBarberData(barberRes.value.data);
      } else {
        console.error('Failed to load barber:', barberRes.reason);
        throw new Error('Failed to load barber profile');
      }

      // Handle appointments
      if (appointmentsRes.status === 'fulfilled') {
        const appts = appointmentsRes.value.data;
        console.log('Appointments loaded:', appts.length);
        setAppointments(Array.isArray(appts) ? appts : []);
        calculateStats(Array.isArray(appts) ? appts : []);
      } else {
        console.warn('  Failed to load appointments:', appointmentsRes.reason);
        setAppointments([]);
        calculateStats([]);
      }

      // Handle shifts
      if (shiftsRes.status === 'fulfilled') {
        const shiftData = shiftsRes.value.data;
        console.log('Shifts loaded:', shiftData.length);
        setShifts(Array.isArray(shiftData) ? shiftData : []);
      } else {
        console.warn('  Failed to load shifts:', shiftsRes.reason);
        setShifts([]);
      }

      // Handle leaves
      if (leavesRes.status === 'fulfilled') {
        const leaveData = leavesRes.value.data;
        console.log('Leaves loaded:', leaveData.length);
        setLeaves(Array.isArray(leaveData) ? leaveData : []);
      } else {
        console.warn('  Failed to load leaves:', leavesRes.reason);
        setLeaves([]);
      }

    } catch (error) {
      console.error('Load data error:', error);
      if (error.response?.status === 401) {
        setError('Session expired - please login again');
        setTimeout(() => handleLogout(), 2000);
      } else {
        setError('Failed to load dashboard data');
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

      // Only count confirmed/completed for earnings
      if (apt.status === 'confirmed' || apt.status === 'completed') {
        totalEarnings += price;
      }

      // Pending payments (not paid yet)
      if (apt.paymentStatus === 'pending') {
        pendingAmount += price;
      }

      // Today's stats
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const barberId = JSON.parse(localStorage.getItem('user-data')).barberId;
      await loadBarberData(barberId, token);
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update: ' + (error.response?.data?.message || error.message));
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadBarberData(barberId, token);
      setLeaveForm({ date: '', reason: '' });
      alert('Leave applied successfully!');
    } catch (error) {
      console.error('Apply leave error:', error);
      alert('Failed to apply leave: ' + (error.response?.data?.message || error.message));
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadBarberData(barberId, token);
      setShiftForm({ dayOfWeek: 0, startTime: '09:00', endTime: '19:00', isOff: false });
      alert('Shift updated successfully!');
    } catch (error) {
      console.error('Shift update error:', error);
      alert('Failed to update: ' + (error.response?.data?.message || error.message));
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await loadBarberData(barberId, token);
      alert('Shift deleted successfully!');
    } catch (error) {
      console.error('Shift delete error:', error);
      alert('Failed to delete: ' + (error.response?.data?.message || error.message));
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