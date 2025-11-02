
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Plus, Edit2, Trash2, X, Clock, Phone, Image as ImageIcon, Building2 } from 'lucide-react';

// Vite environment variable (MUST be prefixed with VITE_)
const API_URL = import.meta.env.VITE_API_URL || 'https://barber-appointment-backend.vercel.app';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    city: '', 
    address: '', 
    openingHours: '', 
    phone: '', 
    image: null 
  });
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/api/branches`);
      setBranches(res.data);
    } catch (err) {
      setError('Failed to load branches. Please refresh the page.');
      console.error('Fetch error:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  // Image compression function
  const compressImage = (file, callback) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const MAX_WIDTH = 800;
        let { width, height } = img;

        if (width > MAX_WIDTH) {
          height = (height * MAX_WIDTH) / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const compressedReader = new FileReader();
          compressedReader.onloadend = () => callback(compressedReader.result);
          compressedReader.readAsDataURL(blob);
        }, 'image/jpeg', 0.7);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

   if (file.size > 5 * 1024 * 1024) {
  alert('Please select an image under 5MB');
  return;
}


    compressImage(file, (base64) => {
      setForm({ ...form, image: base64 });
      setPreview(base64);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.city || !form.address || !form.openingHours || !form.phone) {
      alert('All fields are required!');
      return;
    }

    const data = {
      name: form.name.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      openingHours: form.openingHours.trim(),
      phone: form.phone.trim(),
      image: form.image
    };

    try {
      setLoading(true);
      setError(null);

      if (editingId) {
        await axios.put(`${API_URL}/api/branches/${editingId}`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        await axios.post(`${API_URL}/api/branches`, data, {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      resetForm();
      fetchBranches();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      setError('Save failed: ' + errorMsg);
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (b) => {
    setForm({
      name: b.name,
      city: b.city,
      address: b.address,
      openingHours: b.openingHours,
      phone: b.phone,
      image: null
    });
    setEditingId(b._id);
    setPreview(getImageSrc(b.image) || '');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/api/branches/${id}`);
        fetchBranches();
      } catch (err) {
        alert('Delete failed: ' + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '', city: '', address: '', openingHours: '', phone: '', image: null });
    setEditingId(null);
    setPreview('');
    setError(null);
  };

  // Smart image URL resolver
  const getImageSrc = (image) => {
    if (!image) return null;
    if (image.startsWith('data:')) return image;
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    return `${API_URL}${image.startsWith('/') ? '' : '/'}${image}`;
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading branches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-[#D4AF37] flex-shrink-0" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Branches Management</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Manage your barbershop locations and details</p>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start gap-3">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-red-800">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 flex-shrink-0">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
            {editingId ? <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
            {editingId ? 'Edit Branch' : 'Add New Branch'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Branch Name *</label>
              <input
                type="text"
                placeholder="e.g. Downtown Branch"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">City *</label>
              <input
                type="text"
                placeholder="e.g. London"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Address *</label>
              <input
                type="text"
                placeholder="e.g. 123 High Street, Downtown"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Opening Hours *</label>
              <input
                type="text"
                placeholder="e.g. Mon-Fri: 9AM-6PM"
                value={form.openingHours}
                onChange={e => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                placeholder="e.g. +44 20 1234 5678"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Branch Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs sm:text-sm text-gray-500 file:mr-3 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-[#D4AF37] file:text-white hover:file:bg-[#C5A028] file:cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">Max 1MB. Images are compressed automatically.</p>
              
              {preview && (
                <div className="mt-3 sm:mt-4 relative inline-block">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-32 sm:h-40 w-auto rounded-lg border border-gray-200 object-cover" 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview('');
                      setForm({ ...form, image: null });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-[#D4AF37] text-white font-medium text-sm sm:text-base rounded-lg hover:bg-[#C5A028] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editingId ? 'Update Branch' : 'Add Branch'}
            </button>
            
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 bg-gray-200 text-gray-700 font-medium text-sm sm:text-base rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Branches List */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Branches</h3>
            <span className="px-2.5 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-full">
              {branches.length} Total
            </span>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {branches.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-gray-600 font-medium">No branches added yet</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Add your first branch location using the form above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {branches.map(branch => {
                const imgSrc = getImageSrc(branch.image);
                return (
                  <div 
                    key={branch._id} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#D4AF37] hover:shadow-md transition"
                  >
                    {imgSrc ? (
                      <img 
                        src={imgSrc} 
                        alt={branch.name}
                        className="w-full h-40 sm:h-48 object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-full h-40 sm:h-48 bg-gray-100 hidden items-center justify-center"
                      style={{ display: imgSrc ? 'none' : 'flex' }}
                    >
                      <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                    </div>

                    <div className="p-3 sm:p-4">
                      <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3">{branch.name}</h4>
                      
                      <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-gray-900">{branch.address}</p>
                            <p className="text-gray-600">{branch.city}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-900">{branch.openingHours}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-900">{branch.phone}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleEdit(branch)} 
                          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs sm:text-sm font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(branch._id)} 
                          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-xs sm:text-sm font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Branches;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { MapPin, Plus, Edit2, Trash2, X, Clock, Phone, Image as ImageIcon, Building2 } from 'lucide-react';

// const Branches = () => {
//   const [branches, setBranches] = useState([]);
//   const [form, setForm] = useState({ 
//     name: '', 
//     city: '', 
//     address: '', 
//     openingHours: '', 
//     phone: '', 
//     image: null 
//   });
//   const [editingId, setEditingId] = useState(null);
//   const [preview, setPreview] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchBranches();
//   }, []);

//   const fetchBranches = async () => {
//     try {
//       setInitialLoading(true);
//       const res = await axios.get('https://barber-appointment-backend.vercel.app/api/branches');
//       setBranches(res.data);
//       setError(null);
//     } catch (err) {
//       setError('Failed to load branches. Please refresh the page.');
//       console.error('Fetch error:', err);
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Validate file size (max 5MB)
//       if (file.size > 5 * 1024 * 1024) {
//         alert('Image size should be less than 5MB');
//         return;
//       }
//       setForm({ ...form, image: file });
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.name || !form.city || !form.address || !form.openingHours || !form.phone) {
//       alert('All fields are required!');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', form.name.trim());
//     formData.append('city', form.city.trim());
//     formData.append('address', form.address.trim());
//     formData.append('openingHours', form.openingHours.trim());
//     formData.append('phone', form.phone.trim());
//     if (form.image) formData.append('image', form.image);

//     try {
//       setLoading(true);
//       setError(null);

//       if (editingId) {
//         await axios.put(`https://barber-appointment-backend.vercel.app/api/branches/${editingId}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       } else {
//         await axios.post('https://barber-appointment-backend.vercel.app/api/branches', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//       }

//       resetForm();
//       fetchBranches();
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
//       setError('Save failed: ' + errorMsg);
//       console.error('Save error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (b) => {
//     setForm({
//       name: b.name,
//       city: b.city,
//       address: b.address,
//       openingHours: b.openingHours,
//       phone: b.phone,
//       image: null
//     });
//     setEditingId(b._id);
//     setPreview(`http://localhost:5000${b.image}`);
//     setError(null);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this branch?')) {
//       try {
//         setLoading(true);
//         await axios.delete(`https://barber-appointment-backend.vercel.app/api/branches/${id}`);
//         fetchBranches();
//       } catch (err) {
//         alert('Delete failed: ' + (err.response?.data?.error || err.message));
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const resetForm = () => {
//     setForm({ name: '', city: '', address: '', openingHours: '', phone: '', image: null });
//     setEditingId(null);
//     setPreview('');
//     setError(null);
//   };

//   if (initialLoading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="text-center">
//           <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-[#D4AF37] rounded-full animate-spin"></div>
//           <p className="mt-4 text-gray-600">Loading branches...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
//         <div className="flex items-center gap-3">
//           <Building2 className="w-8 h-8 text-[#D4AF37]" />
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Branches Management</h2>
//             <p className="text-sm text-gray-600">Manage your barbershop locations and details</p>
//           </div>
//         </div>
//       </div>

//       {/* Error Alert */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
//           <div className="flex-1">
//             <p className="text-sm text-red-800">{error}</p>
//           </div>
//           <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//       )}

//       {/* Form */}
//       <div className="bg-white rounded-lg shadow border border-gray-200">
//         <div className="border-b border-gray-200 px-6 py-4">
//           <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//             {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
//             {editingId ? 'Edit Branch' : 'Add New Branch'}
//           </h3>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Branch Name *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Downtown Branch"
//                 value={form.name}
//                 onChange={e => setForm({ ...form, name: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
//                 required
//               />
//             </div>

//             {/* City */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 City *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. London"
//                 value={form.city}
//                 onChange={e => setForm({ ...form, city: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
//                 required
//               />
//             </div>

//             {/* Address */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Address *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. 123 High Street, Downtown"
//                 value={form.address}
//                 onChange={e => setForm({ ...form, address: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
//                 required
//               />
//             </div>

//             {/* Opening Hours */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Opening Hours *
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Mon-Fri: 9AM-6PM"
//                 value={form.openingHours}
//                 onChange={e => setForm({ ...form, openingHours: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
//                 required
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Phone Number *
//               </label>
//               <input
//                 type="tel"
//                 placeholder="e.g. +44 20 1234 5678"
//                 value={form.phone}
//                 onChange={e => setForm({ ...form, phone: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition"
//                 required
//               />
//             </div>

//             {/* Image Upload */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Branch Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37] file:text-white hover:file:bg-[#C5A028] file:cursor-pointer"
//               />
//               <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
              
//               {preview && (
//                 <div className="mt-4 relative inline-block">
//                   <img 
//                     src={preview} 
//                     alt="Preview" 
//                     className="h-40 w-auto rounded-lg border border-gray-200 object-cover" 
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setPreview('');
//                       setForm({ ...form, image: null });
//                     }}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 mt-6">
//             <button 
//               type="submit" 
//               disabled={loading}
//               className="px-6 py-2 bg-[#D4AF37] text-white font-medium rounded-lg hover:bg-[#C5A028] transition disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Saving...' : editingId ? 'Update Branch' : 'Add Branch'}
//             </button>
            
//             {editingId && (
//               <button 
//                 type="button" 
//                 onClick={resetForm} 
//                 className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>
//       </div>

//       {/* Branches List */}
//       <div className="bg-white rounded-lg shadow border border-gray-200">
//         <div className="border-b border-gray-200 px-6 py-4">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-gray-900">All Branches</h3>
//             <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
//               {branches.length} Total
//             </span>
//           </div>
//         </div>
        
//         <div className="p-6">
//           {branches.length === 0 ? (
//             <div className="text-center py-12">
//               <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-600 font-medium">No branches added yet</p>
//               <p className="text-sm text-gray-500 mt-1">Add your first branch location using the form above</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {branches.map(branch => (
//                 <div 
//                   key={branch._id} 
//                   className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#D4AF37] hover:shadow-md transition"
//                 >
//                   {/* Image */}
//                   {branch.image ? (
//                     <img 
//                       src={`http://localhost:5000${branch.image}`} 
//                       alt={branch.name}
//                       className="w-full h-48 object-cover"
//                       onError={(e) => {
//                         e.target.style.display = 'none';
//                         e.target.nextSibling.style.display = 'flex';
//                       }}
//                     />
//                   ) : null}
//                   <div 
//                     className="w-full h-48 bg-gray-100 hidden items-center justify-center"
//                     style={{ display: branch.image ? 'none' : 'flex' }}
//                   >
//                     <ImageIcon className="w-12 h-12 text-gray-400" />
//                   </div>

//                   {/* Details */}
//                   <div className="p-4">
//                     <h4 className="font-bold text-lg text-gray-900 mb-3">{branch.name}</h4>
                    
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-start gap-2">
//                         <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
//                         <div>
//                           <p className="text-gray-900">{branch.address}</p>
//                           <p className="text-gray-600">{branch.city}</p>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-2">
//                         <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                         <span className="text-gray-900">{branch.openingHours}</span>
//                       </div>
                      
//                       <div className="flex items-center gap-2">
//                         <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
//                         <span className="text-gray-900">{branch.phone}</span>
//                       </div>
//                     </div>

//                     {/* Actions */}
//                     <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
//                       <button 
//                         onClick={() => handleEdit(branch)} 
//                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                         Edit
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(branch._id)} 
//                         className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Branches;