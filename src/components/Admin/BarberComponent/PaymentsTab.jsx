import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, ExternalLink, CheckCircle, AlertCircle, Loader, RefreshCw, ArrowUpRight, Clock } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://barber-appointment-backend.vercel.app/api';

function PaymentsTab({ appointments }) {
  const [stripeStatus, setStripeStatus] = useState(null);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    pendingAmount: 0,
    transferredAmount: 0,
    totalPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [appointments]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return { Authorization: `Bearer ${token}` };
  };

  const loadData = async () => {
    await Promise.all([
      checkStripeStatus(),
      fetchPayments()
    ]);
  };

  const checkStripeStatus = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/payments/stripe/status`, { headers });
      setStripeStatus(res.data);
      console.log('✅ Stripe status:', res.data);
    } catch (err) {
      console.error('❌ Stripe status error:', err);
      setStripeStatus({ connected: false });
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/payments/barber/me`, { headers });
      
      const fetchedPayments = res.data.payments || [];
      const fetchedSummary = res.data.summary || {
        totalEarnings: 0,
        pendingAmount: 0,
        transferredAmount: 0,
        totalPayments: 0
      };

      setPayments(fetchedPayments);
      setSummary(fetchedSummary);
      
      console.log('✅ Payments loaded:', fetchedPayments.length);
      console.log('✅ Summary:', fetchedSummary);
    } catch (err) {
      console.error('❌ Fetch payments error:', err);
      setPayments([]);
      setSummary({
        totalEarnings: 0,
        pendingAmount: 0,
        transferredAmount: 0,
        totalPayments: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleStripeConnect = async () => {
    if (connectLoading) return;
    
    try {
      setConnectLoading(true);
      const headers = getAuthHeaders();
      
      console.log('🔗 Connecting to Stripe...');
      const res = await axios.post(`${API_BASE}/payments/stripe/connect`, {}, { headers });
      
      console.log('✅ Stripe response:', res.data);

      if (res.data.onboardingUrl) {
        console.log('↗️ Redirecting to onboarding...');
        window.location.href = res.data.onboardingUrl;
      } else if (res.data.loginUrl) {
        console.log('🔓 Opening Stripe dashboard...');
        window.open(res.data.loginUrl, '_blank');
        await handleRefresh();
      }
    } catch (err) {
      console.error('❌ Stripe connect error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Connection failed';
      alert('Failed to connect Stripe: ' + errorMsg);
    } finally {
      setConnectLoading(false);
    }
  };

  // Calculate from appointments for comparison
  const paidAppointments = appointments.filter(apt => apt.paymentStatus === 'paid');
  const pendingAppointments = appointments.filter(apt => apt.paymentStatus === 'pending');
  
  const totalPaid = paidAppointments.reduce((sum, apt) => sum + (apt.totalPrice || 0), 0);
  const totalPending = pendingAppointments.reduce((sum, apt) => sum + (apt.totalPrice || 0), 0);

  // Calculate barber's share (90%)
  const barberShareFromAppointments = totalPaid * 0.9;
  const platformFee = totalPaid * 0.1;

  // Use backend data (primary source)
  const displayEarnings = summary.totalEarnings;
  const displayPending = summary.pendingAmount;
  const displayTransferred = summary.transferredAmount;
  const displayUpcoming = totalPending * 0.9;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-16 h-16 animate-spin text-[#D4AF37] mb-4" />
        <p className="text-gray-600 font-medium">Loading payment data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Payments & Earnings</h2>
          <p className="text-gray-600 mt-1">Manage your Stripe account and view earnings</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#D4AF37] hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="font-medium text-sm">Refresh</span>
        </button>
      </div>

      {/* Stripe Connect Banner */}
      {!stripeStatus?.connected && (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">
                Connect Your Stripe Account
              </h3>
              <p className="text-blue-100 text-base mb-6 leading-relaxed">
                Link your Stripe account to receive automatic payments directly to your bank. 
                You earn 90% of every booking - we keep just 10% to maintain the platform.
              </p>
              <button
                onClick={handleStripeConnect}
                disabled={connectLoading}
                className="bg-white text-blue-600 px-8 py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {connectLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    <span>Connect Stripe Now</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {stripeStatus?.connected && (
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Stripe Connected Successfully</h3>
                <p className="text-green-100 text-sm">
                  Payments automatically transfer to your bank account
                </p>
              </div>
            </div>
            <button
              onClick={handleStripeConnect}
              disabled={connectLoading}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Manage</span>
            </button>
          </div>
        </div>
      )}

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-6 rounded-2xl shadow-sm border-2 border-emerald-100 hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold bg-emerald-500 text-white px-3 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">
              £{displayEarnings.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-600 font-semibold">Total Earnings (90%)</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold">{summary.totalPayments} payments</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-6 rounded-2xl shadow-sm border-2 border-blue-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold bg-blue-500 text-white px-3 py-1 rounded-full">
                Sent
              </span>
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">
              £{displayTransferred.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-600 font-semibold">Transferred to Bank</p>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                style={{ width: displayEarnings > 0 ? `${(displayTransferred / displayEarnings) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-6 rounded-2xl shadow-sm border-2 border-amber-100 hover:shadow-2xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold bg-amber-500 text-white px-3 py-1 rounded-full">
                Pending
              </span>
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">
              £{displayPending.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-600 font-semibold">Awaiting Transfer</p>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500" 
                style={{ width: displayPending > 0 ? '65%' : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-purple-50 via-white to-purple-50/30 p-6 rounded-2xl shadow-sm border-2 border-purple-100 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold bg-purple-500 text-white px-3 py-1 rounded-full">
                Expected
              </span>
            </div>
            <h3 className="text-4xl font-black text-gray-900 mb-2">
              £{displayUpcoming.toFixed(2)}
            </h3>
            <p className="text-sm text-gray-600 font-semibold">Upcoming Bookings</p>
            <div className="mt-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                    i < 3 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Fee Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-bold text-blue-900 mb-3 text-lg">Payment Breakdown</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-blue-700 font-medium mb-1">Total Received</p>
                <p className="text-2xl font-bold text-blue-900">£{totalPaid.toFixed(2)}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-green-700 font-medium mb-1">Your Share (90%)</p>
                <p className="text-2xl font-bold text-green-600">£{barberShareFromAppointments.toFixed(2)}</p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-gray-700 font-medium mb-1">Platform Fee (10%)</p>
                <p className="text-2xl font-bold text-gray-600">£{platformFee.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        <div className="border-b-2 border-gray-100 px-8 py-6 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-2xl font-bold text-gray-900">Payment History</h3>
          <p className="text-sm text-gray-600 mt-1">All your transaction records</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Your Share</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment Status</th>
                <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Transfer Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="inline-flex p-6 bg-gray-50 rounded-2xl mb-4">
                      <CreditCard className="w-16 h-16 text-gray-300" />
                    </div>
                    <p className="text-gray-600 font-bold text-lg">No payments yet</p>
                    <p className="text-sm text-gray-500 mt-2">Payments will appear here when customers pay online</p>
                  </td>
                </tr>
              ) : (
                payments.map(payment => (
                  <tr key={payment._id} className="hover:bg-blue-50/30 transition-colors duration-200">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-black text-blue-700 border-2 border-blue-200">
                          {payment.customerName?.charAt(0).toUpperCase() || 'G'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{payment.customerName || 'Guest'}</p>
                          <p className="text-xs text-gray-500">{payment.customerEmail || 'No email'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(payment.createdAt).toLocaleDateString('en-GB', { 
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {new Date(payment.createdAt).toLocaleTimeString('en-GB', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-lg font-black text-gray-900">
                        £{(payment.totalAmount || 0).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-lg font-black text-green-600">
                        £{(payment.barberAmount || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 font-bold">90% of total</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 ${
                        payment.status === 'succeeded' 
                          ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-200' 
                          : payment.status === 'failed'
                          ? 'bg-red-100 text-red-700 border-2 border-red-200'
                          : 'bg-amber-100 text-amber-700 border-2 border-amber-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          payment.status === 'succeeded' ? 'bg-emerald-500' : 
                          payment.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                        }`}></div>
                        {payment.status === 'succeeded' ? 'Paid' : 
                         payment.status === 'failed' ? 'Failed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 ${
                        payment.transferStatus === 'completed' 
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-200' 
                          : payment.transferStatus === 'failed'
                          ? 'bg-red-100 text-red-700 border-2 border-red-200'
                          : 'bg-gray-100 text-gray-700 border-2 border-gray-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          payment.transferStatus === 'completed' ? 'bg-blue-500' : 
                          payment.transferStatus === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                        }`}></div>
                        {payment.transferStatus === 'completed' ? 'Transferred' : 
                         payment.transferStatus === 'failed' ? 'Failed' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentsTab;