import React, { useState, useEffect } from 'react';
import { Scissors, Clock, DollarSign, User } from 'lucide-react';

const API_BASE = 'https://barber-appointment-backend.vercel.app';

const BranchServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterGender, setFilterGender] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/branch-admin/services`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch services');

      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    if (filterGender === 'all') return true;
    return service.gender === filterGender;
  });

  const maleServices = services.filter(s => s.gender === 'male');
  const femaleServices = services.filter(s => s.gender === 'female');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-yellow-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Scissors className="w-7 h-7 text-yellow-500" />
          Services (Read-Only)
        </h2>
        <p className="text-gray-600 mt-1">View available services at your branch</p>
        <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            ℹ️ <strong>Note:</strong> Services are managed by Main Admin only. Contact Main Admin to add, edit, or remove services.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Gender
        </label>
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
        >
          <option value="all">All Services</option>
          <option value="male">Male Services</option>
          <option value="female">Female Services</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Services</p>
              <p className="text-3xl font-bold text-gray-900">{services.length}</p>
            </div>
            <Scissors className="w-10 h-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Male Services</p>
              <p className="text-3xl font-bold text-gray-900">{maleServices.length}</p>
            </div>
            <User className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Female Services</p>
              <p className="text-3xl font-bold text-gray-900">{femaleServices.length}</p>
            </div>
            <User className="w-10 h-10 text-pink-500" />
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-xl shadow">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Services</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
              {filteredServices.length} Services
            </span>
          </div>
        </div>

        <div className="p-6">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Scissors className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No services found</p>
              <p className="text-sm text-gray-500 mt-1">Try adjusting your filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service._id}
                  className={`border-2 rounded-lg p-4 hover:shadow-md transition ${
                    service.gender === 'male' 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-pink-200 bg-pink-50'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        service.gender === 'male' ? 'bg-blue-100' : 'bg-pink-100'
                      }`}>
                        <Scissors className={`w-5 h-5 ${
                          service.gender === 'male' ? 'text-blue-600' : 'text-pink-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{service.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          service.gender === 'male' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-pink-100 text-pink-700'
                        }`}>
                          {service.gender === 'male' ? 'Male' : 'Female'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Duration:</span>
                      <span className="text-gray-900 font-medium">{service.duration}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Price:</span>
                      <span className="text-gray-900 font-bold">{service.price}</span>
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
};

export default BranchServices;