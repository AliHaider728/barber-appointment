import React, { useState, useEffect } from 'react';
import { Users, Award, MapPin, User, Mail } from 'lucide-react';

const API_BASE = 'https://barber-appointment-backend.vercel.app';

const BranchBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchBarbers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/branch-admin/barbers`, {
        headers: getAuthHeaders()
      });

      // Parse body regardless of status
      const data = await response.json();

      if (!response.ok) {
        console.error('Error details from backend:', data);  // This will log the full error object
        throw new Error(data.error || data.message || 'Failed to fetch barbers');
      }

      setBarbers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading barbers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" />
          Branch Barbers (View Only)
        </h2>
        <p className="text-gray-600 text-sm mt-1">View barbers assigned to your branch</p>
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Note:</strong> You can only view barbers. Contact Main Admin to add, edit, or remove barbers.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Barbers List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Barbers</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {barbers.length} Total
            </span>
          </div>
        </div>

        <div className="p-6">
          {barbers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No barbers found</p>
              <p className="text-sm text-gray-500 mt-1">Contact Main Admin to add barbers to your branch</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {barbers.map((barber) => (
                <div
                  key={barber._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{barber.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Award className="w-4 h-4" />
                          <span>{barber.experienceYears} years • {barber.gender}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900 font-medium">{barber.email}</span>
                  </div>

                  {/* Branch */}
                  <div className="flex items-center gap-2 text-sm mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Branch:</span>
                    <span className="text-gray-900 font-medium">
                      {barber.branch?.name || 'Not Assigned'}
                    </span>
                  </div>

                  {/* Services */}
                  <div className="space-y-3">
                    {barber.gender === 'male' && barber.specialties?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 text-xs font-medium text-blue-700 mb-1">
                          <User className="w-3 h-3" />
                          <span>Male Services ({barber.specialties.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {barber.specialties.map((service, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {barber.gender === 'female' && barber.specialties?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-1 text-xs font-medium text-pink-700 mb-1">
                          <User className="w-3 h-3" />
                          <span>Female Services ({barber.specialties.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {barber.specialties.map((service, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-xs bg-pink-50 text-pink-700 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!barber.specialties || barber.specialties.length === 0) && (
                      <p className="text-xs text-gray-400 italic">No services assigned</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BranchBarbers;