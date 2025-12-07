// components/ScheduleTab.jsx

import { Edit2, Trash2 } from 'lucide-react';

function ScheduleTab({
  shifts,
  shiftForm,
  daysOfWeek,
  handleShiftChange,
  handleShiftSubmit,
  handleEditShift,
  handleDeleteShift
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Shift Update Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Update My Schedule</h3>
        </div>
        <form onSubmit={handleShiftSubmit} className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                name="dayOfWeek"
                value={shiftForm.dayOfWeek}
                onChange={handleShiftChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              >
                {daysOfWeek.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={shiftForm.startTime}
                onChange={handleShiftChange}
                disabled={shiftForm.isOff}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={shiftForm.endTime}
                onChange={handleShiftChange}
                disabled={shiftForm.isOff}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div className="flex items-center gap-4 lg:pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  name="isOff"
                  checked={shiftForm.isOff}
                  onChange={handleShiftChange}
                  className="w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">Day Off</span>
              </label>
              <button
                type="submit"
                className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-black hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                Update Shift
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">My Weekly Schedule</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {daysOfWeek.map(day => {
              const shift = shifts.find(s => s.dayOfWeek === day.value);
              return (
                <div
                  key={day.value}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${shift?.isOff ? 'bg-red-50 border-red-300' :
                    shift ? 'bg-green-50 border-green-300' :
                      'bg-gray-50 border-gray-300'
                    }`}
                >
                  <p className="text-sm font-bold text-gray-700 mb-3">{day.label}</p>
                  {shift ? (
                    shift.isOff ? (
                      <p className="text-base font-bold text-red-600 mb-3">Day Off</p>
                    ) : (
                      <div className="space-y-1 mb-3">
                        <p className="text-base font-bold text-gray-900">{shift.startTime}</p>
                        <p className="text-sm text-gray-600">to {shift.endTime}</p>
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-gray-400 italic mb-3">No shift</p>
                  )}
                  {shift && (
                    <div className="flex gap-3 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleEditShift(shift)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteShift(shift._id)}
                        className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 hover:underline transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScheduleTab;