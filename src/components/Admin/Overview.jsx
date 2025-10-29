import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Overview = () => {
  const [stats, setStats] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [apptRes, barberRes, branchRes] = await Promise.all([
      axios.get('http://localhost:5000/api/appointments'),
      axios.get('http://localhost:5000/api/barbers'),
      axios.get('http://localhost:5000/api/branches')
    ]); 
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = apptRes.data.filter(a => a.date.startsWith(today));

    setStats({
      totalAppts: apptRes.data.length,
      barbers: barberRes.data.length,
      branches: branchRes.data.length,
      todayAppts: todayAppts.length
    });
    setTodayAppointments(todayAppts);
  };

  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-3xl font-bold">{stats.totalAppts}</h3><p>Total Appointments</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-3xl font-bold">{stats.todayAppts}</h3><p>Today's Appointments</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-3xl font-bold">{stats.barbers}</h3><p>Barbers</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-3xl font-bold">{stats.branches}</h3><p>Branches</p></div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">Today's Appointments</h3>
        {todayAppointments.map(a => (
          <div key={a._id} className="flex justify-between border-b py-2">
            <span>{a.customerName} - {a.service}</span>
            <span>{new Date(a.date).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;

// //import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Calendar, Users, MapPin, TrendingUp, Clock, Scissors, ChevronRight } from 'lucide-react';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// const Overview = () => {
//   const [stats, setStats] = useState({});
//   const [todayAppointments, setTodayAppointments] = useState([]);
//   const [weeklyData, setWeeklyData] = useState([]);
//   const [statusData, setStatusData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       setLoading(true);
//       const [apptRes, barberRes, branchRes] = await Promise.all([
//         axios.get('http://localhost:5000/api/appointments'),
//         axios.get('http://localhost:5000/api/barbers'),
//         axios.get('http://localhost:5000/api/branches')
//       ]);

//       const today = new Date().toISOString().split('T')[0];
//       const todayAppts = apptRes.data.filter(a => a.date.startsWith(today));

//       // Calculate weekly data for chart
//       const last7Days = [];
//       for (let i = 6; i >= 0; i--) {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         const dateStr = date.toISOString().split('T')[0];
//         const count = apptRes.data.filter(a => a.date.startsWith(dateStr)).length;
//         last7Days.push({
//           day: date.toLocaleDateString('en-US', { weekday: 'short' }),
//           appointments: count
//         });
//       }

//       // Calculate status distribution
//       const statusCount = apptRes.data.reduce((acc, appt) => {
//         acc[appt.status] = (acc[appt.status] || 0) + 1;
//         return acc;
//       }, {});

//       const statusChart = Object.entries(statusCount).map(([name, value]) => ({
//         name: name.charAt(0).toUpperCase() + name.slice(1),
//         value
//       }));

//       setStats({
//         totalAppts: apptRes.data.length,
//         barbers: barberRes.data.length,
//         branches: branchRes.data.length,
//         todayAppts: todayAppts.length
//       });
//       setTodayAppointments(todayAppts.slice(0, 5)); // Show only 5 recent
//       setWeeklyData(last7Days);
//       setStatusData(statusChart);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     { 
//       title: 'Total Appointments', 
//       value: stats.totalAppts, 
//       icon: Calendar, 
//       color: 'from-[#D4AF37] to-[#F4D03F]',
//       bgColor: 'bg-gradient-to-br from-[#D4AF37]/10 to-[#F4D03F]/10'
//     },
//     { 
//       title: "Today's Appointments", 
//       value: stats.todayAppts, 
//       icon: Clock, 
//       color: 'from-blue-500 to-blue-600',
//       bgColor: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10'
//     },
//     { 
//       title: 'Total Barbers', 
//       value: stats.barbers, 
//       icon: Users, 
//       color: 'from-green-500 to-green-600',
//       bgColor: 'bg-gradient-to-br from-green-500/10 to-green-600/10'
//     },
//     { 
//       title: 'Total Branches', 
//       value: stats.branches, 
//       icon: MapPin, 
//       color: 'from-purple-500 to-purple-600',
//       bgColor: 'bg-gradient-to-br from-purple-500/10 to-purple-600/10'
//     }
//   ];

//   const COLORS = ['#D4AF37', '#F4D03F', '#3B82F6', '#10B981', '#8B5CF6'];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-[#D4AF37]"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <div 
//               key={index}
//               className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-[#D4AF37] group"
//             >
//               <div className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`${stat.bgColor} p-3 rounded-xl`}>
//                     <Icon className={`w-7 h-7 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
//                   </div>
//                   <TrendingUp className="w-5 h-5 text-green-500" />
//                 </div>
//                 <h3 className="text-4xl font-black text-gray-900 mb-2">{stat.value || 0}</h3>
//                 <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
//               </div>
//               <div className={`h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Charts Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Weekly Appointments Chart */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Weekly Overview</h3>
//               <p className="text-sm text-gray-600 mt-1">Appointments in last 7 days</p>
//             </div>
//             <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
//               <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={weeklyData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="day" stroke="#666" style={{ fontSize: '12px', fontWeight: '600' }} />
//               <YAxis stroke="#666" style={{ fontSize: '12px', fontWeight: '600' }} />
//               <Tooltip 
//                 contentStyle={{ 
//                   background: '#fff', 
//                   border: '2px solid #D4AF37',
//                   borderRadius: '12px',
//                   fontWeight: '600'
//                 }} 
//               />
//               <Bar dataKey="appointments" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
//               <defs>
//                 <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor="#D4AF37" />
//                   <stop offset="100%" stopColor="#F4D03F" />
//                 </linearGradient>
//               </defs>
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Status Distribution Chart */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Appointment Status</h3>
//               <p className="text-sm text-gray-600 mt-1">Distribution by status</p>
//             </div>
//             <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
//               <Scissors className="w-6 h-6 text-[#D4AF37]" />
//             </div>
//           </div>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={statusData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {statusData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip 
//                 contentStyle={{ 
//                   background: '#fff', 
//                   border: '2px solid #D4AF37',
//                   borderRadius: '12px',
//                   fontWeight: '600'
//                 }} 
//               />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Today's Appointments */}
//       <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
//         <div className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] p-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
//                 <Calendar className="w-6 h-6 text-black" />
//               </div>
//               <div>
//                 <h3 className="text-2xl font-black text-black uppercase tracking-tight">Today's Appointments</h3>
//                 <p className="text-sm text-black/80 font-medium">Latest bookings for today</p>
//               </div>
//             </div>
//             <span className="bg-black text-white px-4 py-2 rounded-full font-bold text-sm">
//               {todayAppointments.length} Total
//             </span>
//           </div>
//         </div>

//         <div className="p-6">
//           {todayAppointments.length === 0 ? (
//             <div className="text-center py-12">
//               <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500 font-semibold">No appointments scheduled for today</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {todayAppointments.map((appt, index) => (
//                 <div 
//                   key={appt._id}
//                   className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-[#D4AF37]/5 hover:to-[#F4D03F]/5 transition-all duration-300 border-2 border-transparent hover:border-[#D4AF37]/20"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] text-black w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg">
//                       {index + 1}
//                     </div>
//                     <div>
//                       <h4 className="font-bold text-gray-900 text-lg">{appt.customerName}</h4>
//                       <p className="text-sm text-gray-600 font-medium">{appt.service}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <div className="text-right">
//                       <p className="text-sm font-bold text-gray-900">
//                         {new Date(appt.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
//                       </p>
//                       <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
//                         appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                         appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {appt.status}
//                       </span>
//                     </div>
//                     <ChevronRight className="w-5 h-5 text-gray-400" />
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

// export default Overview;