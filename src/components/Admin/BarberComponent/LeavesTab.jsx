// components/LeavesTab.jsx

function LeavesTab({ leaves, leaveForm, handleLeaveChange, handleApplyLeave }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Apply for Leave</h3>
        </div>
        <form onSubmit={handleApplyLeave} className="p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={leaveForm.date}
              onChange={handleLeaveChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea
              name="reason"
              value={leaveForm.reason}
              onChange={handleLeaveChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-black hover:text-white transition"
          >
            Apply Leave
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Leave History ({leaves.length})</h3>
        </div>
        <div className="p-4 sm:p-6">
          {leaves.length === 0 ? (
            <p className="text-center text-gray-500 text-sm sm:text-base">No leaves applied yet</p>
          ) : (
            <ul className="space-y-4">
              {leaves.map((leave, idx) => (
                <li key={idx} className="border-b border-gray-100 pb-4 last:border-0">
                  <p className="font-medium text-gray-900 text-sm sm:text-base">Date: {new Date(leave.date).toLocaleDateString()}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Reason: {leave.reason}</p>
                  <p className="text-xs text-gray-500">Status: {leave.status || 'Pending'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default LeavesTab;