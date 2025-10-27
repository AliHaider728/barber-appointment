import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, BarChart2, Calendar, Users, MapPin, Scissors } from 'lucide-react';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch appointments (simulated for now, will connect to backend later)
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/appointments');
        const data = await response.json();
        setAppointments(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleLogout = () => {
    // Simulate logout
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="flex items-center bg-[#D4AF37] text-black font-bold py-2 px-4 rounded-lg hover:bg-black hover:text-white transition"
        >
          Logout <LogOut className="ml-2 w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/overview" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <BarChart2 className="w-8 h-8 text-[#D4AF37] mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Overview</h3>
          </Link>
          <Link to="/admin/appointments" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <Calendar className="w-8 h-8 text-[#D4AF37] mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
          </Link>
          <Link to="/admin/barbers" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <Users className="w-8 h-8 text-[#D4AF37] mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Barbers</h3>
          </Link>
          <Link to="/admin/branches" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <MapPin className="w-8 h-8 text-[#D4AF37] mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Branches</h3>
          </Link>
          <Link to="/admin/services" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <Scissors className="w-8 h-8 text-[#D4AF37] mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">Services</h3>
          </Link>
        </div>

        {/* Appointments Overview */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h3>
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : appointments.length > 0 ? (
            <ul className="space-y-2">
              {appointments.map((appointment) => (
                <li key={appointment._id} className="text-gray-700">
                  {appointment.customerName} - {new Date(appointment.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No appointments yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;