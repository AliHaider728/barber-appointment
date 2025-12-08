
import { Edit2, Trash2, Clock } from 'lucide-react';

function ScheduleTab({
  shifts,
  shiftForm,
  daysOfWeek,
  handleShiftChange,
  handleShiftSubmit,
  handleEditShift,
  handleDeleteShift
}) {
  const onSubmit = (e) => {
    e.preventDefault();
    handleShiftSubmit(e);
  };

  return (
    <div className="space-y-6">
      {/* Premium Shift Update Form */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Update My Schedule</h3>
            <p className="text-sm text-gray-500 mt-0.5">Manage your weekly availability</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Day of Week</label>
              <select
                name="dayOfWeek"
                value={shiftForm.dayOfWeek}
                onChange={handleShiftChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 font-medium text-gray-900"
              >
                {daysOfWeek.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={shiftForm.startTime}
                onChange={handleShiftChange}
                disabled={shiftForm.isOff}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium text-gray-900"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                name="endTime"
                value={shiftForm.endTime}
                onChange={handleShiftChange}
                disabled={shiftForm.isOff}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed font-medium text-gray-900"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Options</label>
              <div className="flex items-center gap-3 h-[42px]">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="isOff"
                    checked={shiftForm.isOff}
                    onChange={handleShiftChange}
                    className="w-5 h-5 text-violet-600 border-gray-300 rounded focus:ring-violet-500 cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Day Off</span>
                </label>
              </div>
            </div>
          </div>
          <button
            onClick={onSubmit}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-[#d4af37] to-[#d2b03e] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#d4af37]/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            Update Shift
          </button>
        </div>
      </div>

      {/* Premium Weekly Schedule Grid */}
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900">My Weekly Schedule</h3>
            <p className="text-sm text-gray-500 mt-0.5">Your working hours for each day</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {daysOfWeek.map(day => {
              const shift = shifts.find(s => s.dayOfWeek === day.value);
              return (
                <div
                  key={day.value}
                  className={`group relative p-5 rounded-xl border-2 transition-all duration-300 hover:shadow-lg overflow-hidden ${
                    shift?.isOff 
                      ? 'bg-gradient-to-br from-red-50 to-red-50/30 border-red-200 hover:border-red-300 hover:shadow-red-100' 
                      : shift 
                      ? 'bg-gradient-to-br from-emerald-50 to-emerald-50/30 border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100' 
                      : 'bg-gradient-to-br from-gray-50 to-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Decorative gradient blob */}
                  <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl ${
                    shift?.isOff 
                      ? 'bg-red-300/20' 
                      : shift 
                      ? 'bg-emerald-300/20' 
                      : 'bg-gray-300/20'
                  }`}></div>
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">{day.label}</p>
                      {shift && (
                        <div className={`w-2 h-2 rounded-full ${
                          shift.isOff ? 'bg-red-500' : 'bg-emerald-500'
                        }`}></div>
                      )}
                    </div>
                    
                    {shift ? (
                      shift.isOff ? (
                        <div className="mb-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-200 rounded-lg">
                            <span className="text-sm font-bold text-red-700">Day Off</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-600" />
                            <p className="text-lg font-bold text-gray-900">{shift.startTime}</p>
                          </div>
                          <p className="text-sm text-gray-600 pl-6">to {shift.endTime}</p>
                        </div>
                      )
                    ) : (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 italic">No shift set</p>
                      </div>
                    )}
                    
                    {shift && (
                      <div className="flex gap-2 pt-3 border-t border-gray-200/50">
                        <button
                          onClick={() => handleEditShift(shift)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteShift(shift._id)}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
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