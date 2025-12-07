// components/LeavesTab.jsx

import { Calendar, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

function LeavesTab({ leaves, leaveForm, handleLeaveChange, handleApplyLeave }) {
  const onSubmit = (e) => {
    e.preventDefault();
    handleApplyLeave(e);
  };

  const pendingLeaves = leaves.filter(l => l.status === 'pending' || !l.status).length;
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length;
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Leave Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{pendingLeaves}</h3>
            <p className="text-sm text-gray-600 font-medium">Awaiting Approval</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Approved</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{approvedLeaves}</h3>
            <p className="text-sm text-gray-600 font-medium">Confirmed Leaves</p>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-red-50 via-white to-red-50/30 p-6 rounded-2xl shadow-sm border border-red-100 hover:shadow-xl hover:shadow-red-100/50 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg shadow-red-500/30">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-red-100 text-red-700 px-3 py-1 rounded-full">Rejected</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{rejectedLeaves}</h3>
            <p className="text-sm text-gray-600 font-medium">Declined Requests</p>
          </div>
        </div>
      </div>

      {/* Apply Leave Form */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-violet-100 to-violet-50 rounded-lg">
              <FileText className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Apply for Leave</h3>
              <p className="text-sm text-gray-500 mt-0.5">Request time off from work</p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={leaveForm.date}
              onChange={handleLeaveChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 font-medium text-gray-900"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
            <textarea
              name="reason"
              value={leaveForm.reason}
              onChange={handleLeaveChange}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 font-medium text-gray-900 resize-none"
              rows="4"
              placeholder="Please provide a reason for your leave request..."
              required
            />
          </div>
          <button
            onClick={onSubmit}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            Submit Leave Request
          </button>
        </div>
      </div>

      {/* Leave History */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Leave History</h3>
              <p className="text-sm text-gray-500 mt-0.5">{leaves.length} total requests</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {leaves.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                <Calendar className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-900 font-semibold text-base">No leaves applied yet</p>
              <p className="text-sm text-gray-500 mt-2">Your leave requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaves.map((leave, idx) => (
                <div key={idx} className="group relative p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 hover:bg-gray-50/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border border-gray-200 flex-shrink-0">
                        <Calendar className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="text-base font-bold text-gray-900">
                            {new Date(leave.date).toLocaleDateString('en-GB', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                          <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                            leave.status === 'approved' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : leave.status === 'rejected'
                              ? 'bg-red-50 text-red-700 border border-red-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                          }`}>
                            {leave.status === 'approved' ? 'Approved' : leave.status === 'rejected' ? 'Rejected' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{leave.reason}</p>
                      </div>
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

export default LeavesTab;