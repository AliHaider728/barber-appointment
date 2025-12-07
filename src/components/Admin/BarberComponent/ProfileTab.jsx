// components/ProfileTab.jsx

import { Scissors, Award, User, MapPin } from 'lucide-react';

function ProfileTab({ barberData }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 px-4 sm:px-6 py-4 bg-gray-50">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">My Profile</h3>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#D4AF37] rounded-full flex items-center justify-center">
            <Scissors className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{barberData.name}</h2>
            <p className="text-gray-600 text-sm sm:text-base">{barberData.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Experience</label>
            <div className="flex items-center gap-2 text-gray-900">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-semibold">{barberData.experienceYears} years</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
            <div className="flex items-center gap-2 text-gray-900">
              <User className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-semibold capitalize">{barberData.gender}</span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
            <div className="flex items-center gap-2 text-gray-900">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              <span className="font-semibold">{barberData.branch?.name}</span>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Specialties</label>
            <div className="flex flex-wrap gap-2">
              {barberData.specialties && barberData.specialties.length > 0 ? (
                barberData.specialties.map((service, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs sm:text-sm font-semibold border border-[#D4AF37]/30"
                  >
                    {service}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No specialties assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;