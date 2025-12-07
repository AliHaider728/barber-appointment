// components/PaymentsTab.jsx

function PaymentsTab({ appointments }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Payments</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {appointments.filter(apt => apt.paymentStatus).length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 sm:px-6 py-8 sm:py-12 text-center text-gray-500 text-sm sm:text-base">
                  No payments found
                </td>
              </tr>
            ) : (
              appointments
                .filter(apt => apt.paymentStatus) // Only show appointments with payment info
                .map(apt => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 text-sm sm:text-base">{apt.customerName}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()}</td>
                    <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-900">£{apt.totalPrice}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${apt.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'
                        }`}>
                        {apt.paymentStatus === 'paid' ? 'Paid' : 'Unpaid/Pending'}
                      </span>
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

export default PaymentsTab;