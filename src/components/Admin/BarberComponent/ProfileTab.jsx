// components/ProfileTab.jsx

import { Scissors, Award, User, MapPin, Star, Sparkles } from 'lucide-react';

function ProfileTab({ barberData }) {
  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="relative bg-gradient-to-br from-amber-50 via-white to-yellow-50 rounded-2xl shadow-sm border border-amber-200/60 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-yellow-400/10 to-amber-400/10 rounded-full blur-3xl"></div>
        
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                <Scissors className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-2">
                {barberData.name}
              </h2>
              <p className="text-gray-600 text-base mb-3">{barberData.email}</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-xl">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">Professional Barber</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="group bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200 hover:shadow-md hover:border-amber-200 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Experience</label>
              </div>
              <p className="text-2xl font-bold text-gray-900 ml-11">{barberData.experienceYears} years</p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Gender</label>
              </div>
              <p className="text-2xl font-bold text-gray-900 capitalize ml-11">{barberData.gender}</p>
            </div>

            <div className="sm:col-span-2 group bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-gray-200 hover:shadow-md hover:border-emerald-200 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Branch Location</label>
              </div>
              <p className="text-xl font-bold text-gray-900 ml-11">{barberData.branch?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">My Specialties</h3>
              <p className="text-sm text-gray-500 mt-0.5">Services I excel at</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {barberData.specialties && barberData.specialties.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {barberData.specialties.map((service, idx) => (
                <div
                  key={idx}
                  className="group relative px-4 py-2.5 bg-gradient-to-br from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 rounded-xl border border-amber-200 hover:border-[#D4AF37] hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/5 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <span className="relative text-sm font-bold text-[#D4AF37]">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                <Scissors className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">No specialties assigned yet</p>
              <p className="text-sm text-gray-400 mt-1">Contact your manager to add specialties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileTab;