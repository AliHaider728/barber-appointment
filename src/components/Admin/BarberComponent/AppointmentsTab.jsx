// components/AppointmentsTab.jsx

function AppointmentsTab({ appointments, handleStatusUpdate }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Appointments ({appointments.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date/Time</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Services</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base">
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map(apt => (
                <tr key={apt._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{apt.customerName}</p>
                    <p className="text-xs text-gray-500">{apt.email}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                    <p>{new Date(apt.date).toLocaleDateString()}</p>
                    <p className="text-xs">{new Date(apt.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">
                    {apt.services?.map(s => s.name).join(', ') || 'N/A'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-900">£{apt.totalPrice}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${apt.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      'bg-orange-100 text-orange-700'
                      }`}>
                      {apt.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {apt.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'confirmed')}
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                      >
                        Confirm
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(apt._id, 'completed')}
                        className="px-2 py-1 sm:px-3 sm:py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
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