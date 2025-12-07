// components/OverviewTab.jsx

import { DollarSign, AlertCircle, Calendar, CheckCircle, TrendingUp, ArrowUpRight } from 'lucide-react';

function OverviewTab({ stats, appointments }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track your business performance in real-time</p>
        </div>
      </div>

      {/* Premium Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings Card */}
        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow duration-300">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{stats.totalEarnings.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">+12.5% from last month</span>
            </div>
          </div>
        </div>

        {/* Pending Payments Card */}
        <div className="group relative bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow duration-300">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{stats.pendingAmount.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">Pending Payments</p>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>

        {/* Today's Bookings Card */}
        <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Today</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.todayAppointments}</h3>
            <p className="text-sm text-gray-600 font-medium">Today's Bookings</p>
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-xs font-semibold">3 more than yesterday</span>
            </div>
          </div>
        </div>

        {/* Completed Today Card */}
        <div className="group relative bg-gradient-to-br from-violet-50 via-white to-violet-50/30 p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-3 py-1 rounded-full">Done</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.completedToday}</h3>
            <p className="text-sm text-gray-600 font-medium">Completed Today</p>
            <div className="mt-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i < stats.completedToday ? 'bg-gradient-to-r from-violet-500 to-violet-600' : 'bg-gray-100'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Recent Appointments */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Appointments</h3>
              <p className="text-sm text-gray-500 mt-0.5">Latest bookings and their status</p>
            </div>
            <button className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              View all →
            </button>
          </div>
        </div>
        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                <Calendar className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-900 font-semibold text-base">No appointments yet</p>
              <p className="text-sm text-gray-500 mt-2">Your bookings will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map((apt, index) => (
                <div key={apt._id} className="group relative p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 hover:bg-gray-50/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-bold text-gray-700 border border-gray-200 flex-shrink-0">
                        {apt.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-base mb-0.5 truncate">{apt.customerName}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(apt.date).toLocaleDateString()}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span>{new Date(apt.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="font-semibold text-gray-900">£{apt.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        apt.paymentStatus === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {apt.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        apt.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                          : apt.status === 'confirmed' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;