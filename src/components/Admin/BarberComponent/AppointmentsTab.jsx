import { Calendar } from 'lucide-react';

function AppointmentsTab({ appointments, handleStatusUpdate }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
      <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">All Appointments</h3>
            <p className="text-sm text-gray-500 mt-0.5">{appointments.length} total bookings</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date/Time</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Services</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-16 text-center">
                  <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                    <Calendar className="w-12 h-12 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">No appointments found</p>
                </td>
              </tr>
            ) : (
              appointments.map(apt => (
                <tr key={apt._id} className="hover:bg-gray-50/50 transition-colors duration-150">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-bold text-gray-700 border border-gray-200 flex-shrink-0">
                        {apt.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{apt.customerName}</p>
                        <p className="text-xs text-gray-500 truncate">{apt.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    <div className="truncate">
                      {apt.services?.map(s => s.name).join(', ') || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-bold text-gray-900">£{apt.totalPrice}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-block ${
                      apt.paymentStatus === 'paid' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {apt.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-block ${
                      apt.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : apt.status === 'confirmed' 
                        ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                        : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {apt.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5"
                      >
                        Confirm
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'completed')}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppointmentsTab;