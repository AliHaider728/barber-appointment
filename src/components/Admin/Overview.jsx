import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Overview = () => {
  const [stats, setStats] = useState({
    totalAppts: 0,
    todayAppts: 0,
    barbers: 0,
    branches: 0,
    totalRevenue: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [apptRes, barberRes, branchRes] = await Promise.all([
        axios.get('http://localhost:5000/api/appointments'),
        axios.get('http://localhost:5000/api/barbers'),
        axios.get('http://localhost:5000/api/branches')
      ]);

      const appointments = apptRes.data;
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointments.filter(a => a.date.startsWith(today));

      // Calculate Total Revenue
      const totalRevenue = appointments.reduce((sum, apt) => {
        if (apt.totalPrice) return sum + apt.totalPrice;
        if (Array.isArray(apt.services)) {
          return sum + apt.services.reduce((s, srv) => {
            const price = srv.price || srv.serviceRef?.price || '£0';
            return s + (parseFloat(price.replace('£', '')) || 0);
          }, 0);
        }
        return sum;
      }, 0);

      // Enrich today's appointments
      const enrichedToday = todayAppts.map(apt => {
        let services = [];
        let totalPrice = 0;

        if (Array.isArray(apt.services)) {
          services = apt.services.map(s => s.name || s.serviceRef?.name || 'Unknown');
          totalPrice = apt.services.reduce((sum, s) => {
            const price = s.price || s.serviceRef?.price || '£0';
            return sum + (parseFloat(price.replace('£', '')) || 0);
          }, 0);
        } else if (apt.service) {
          services = [apt.service];
          totalPrice = 0;
        }

        return {
          ...apt,
          displayServices: services.filter(Boolean).join(', ') || 'N/A',
          displayTotal: totalPrice.toFixed(2)
        };
      });

      setStats({
        totalAppts: appointments.length,
        todayAppts: todayAppts.length,
        barbers: barberRes.data.length,
        branches: branchRes.data.length,
        totalRevenue: totalRevenue.toFixed(2)
      });

      setTodayAppointments(enrichedToday);
    } catch (error) {
      console.error('Error fetching stats:', error);
      alert('Failed to load dashboard data');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Total Appointments */}
        <div className="bg-white p-6 rounded-xl shadow border-2 border-gray-100">
          <h3 className="text-3xl font-bold text-blue-600">{stats.totalAppts}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Appointments</p>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white p-6 rounded-xl shadow border-2 border-gray-100">
          <h3 className="text-3xl font-bold text-green-600">{stats.todayAppts}</h3>
          <p className="text-sm text-gray-600 mt-1">Today's Appointments</p>
        </div>

        {/* Total Barbers */}
        <div className="bg-white p-6 rounded-xl shadow border-2 border-gray-100">
          <h3 className="text-3xl font-bold text-purple-600">{stats.barbers}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Barbers</p>
        </div>

        {/* Total Branches */}
        <div className="bg-white p-6 rounded-xl shadow border-2 border-gray-100">
          <h3 className="text-3xl font-bold text-orange-600">{stats.branches}</h3>
          <p className="text-sm text-gray-600 mt-1">Total Branches</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] p-6 rounded-xl shadow-lg border-2 border-[#D4AF37]">
          <h3 className="text-3xl font-black text-black">£{stats.totalRevenue}</h3>
          <p className="text-sm font-bold text-black/80 mt-1">Total Revenue</p>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white p-6 rounded-xl shadow border-2 border-gray-100">
        <h3 className="text-xl font-bold mb-4 text-gray-900">Today's Appointments</h3>
        
        {todayAppointments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No appointments for today</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((a, index) => (
              <div 
                key={a._id} 
                className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 py-3 last:border-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">{a.customerName}</span>
                    <span className="text-xs bg-[#D4AF37] text-black px-2 py-1 rounded-full font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Services:</strong> {a.displayServices}
                  </p>
                  {a.displayTotal > 0 && (
                    <p className="text-sm font-bold text-[#D4AF37] mt-1">
                      Total: £{a.displayTotal}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(a.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                      a.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {a.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;