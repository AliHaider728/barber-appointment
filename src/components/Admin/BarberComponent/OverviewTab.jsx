// components/OverviewTab.jsx

import { DollarSign, AlertCircle, Calendar, CheckCircle } from 'lucide-react';

function OverviewTab({ stats, appointments }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Total</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">£{stats.totalEarnings.toFixed(2)}</h3>
          <p className="text-sm text-gray-600">Total Earnings</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Pending</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">£{stats.pendingAmount.toFixed(2)}</h3>
          <p className="text-sm text-gray-600">Pending Payments</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Today</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.todayAppointments}</h3>
          <p className="text-sm text-gray-600">Today's Bookings</p>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Done</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.completedToday}</h3>
          <p className="text-sm text-gray-600">Completed Today</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Appointments</h3>
        </div>
        <div className="p-4 sm:p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-sm sm:text-base">No appointments yet</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Your bookings will appear here</p>
            </div>
          ) : (
            appointments.slice(0, 5).map(apt => (
              <div key={apt._id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{apt.customerName}</p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {new Date(apt.date).toLocaleDateString()} at {new Date(apt.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} • £{apt.totalPrice}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Payment: {apt.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                  </p>
                </div>
                <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                  apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;