import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, ExternalLink, CheckCircle, AlertCircle, Loader, Clock, RefreshCw } from 'lucide-react';
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
      console.log('  Stripe status:', res.data);
    } catch (err) {
      console.error('  Stripe status error:', err);
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
      
      console.log('  Payments loaded:', fetchedPayments.length);
    } catch (err) {
      console.error('  Fetch payments error:', err);
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
      
      console.log('  Stripe response:', res.data);

      if (res.data.onboardingUrl) {
        console.log('↗️ Redirecting to onboarding...');
        window.location.href = res.data.onboardingUrl;
      } else if (res.data.loginUrl) {
        console.log('🔓 Opening Stripe dashboard...');
        window.open(res.data.loginUrl, '_blank');
        await handleRefresh();
      }
    } catch (err) {
      console.error('  Stripe connect error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Connection failed';
      alert('Failed to connect Stripe: ' + errorMsg);
    } finally {
      setConnectLoading(false);
    }
  };

  // Calculate from appointments
  const paidAppointments = appointments.filter(apt => apt.paymentStatus === 'paid');
  const pendingAppointments = appointments.filter(apt => apt.paymentStatus === 'pending');
  
  const totalPaid = paidAppointments.reduce((sum, apt) => sum + (apt.totalPrice || 0), 0);
  const totalPending = pendingAppointments.reduce((sum, apt) => sum + (apt.totalPrice || 0), 0);

  const barberShareFromAppointments = totalPaid * 0.9;
  const platformFee = totalPaid * 0.1;

  const displayEarnings = summary.totalEarnings;
  const displayPending = summary.pendingAmount;
  const displayTransferred = summary.transferredAmount;
  const displayUpcoming = totalPending * 0.9;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-12 h-12 animate-spin text-gray-900 mb-3" />
        <p className="text-gray-600">Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
            Payments & Earnings
          </h2>
          <p className="text-sm text-gray-500 mt-1">Track your business performance in real-time</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="font-medium text-sm">Refresh</span>
        </button>
      </div>

      {/* Stripe Connect Banner */}
      {!stripeStatus?.connected ? (
        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Stripe Account</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Link your Stripe account to receive payments. You earn 90% of every booking.
              </p>
              <button
                onClick={handleStripeConnect}
                disabled={connectLoading}
                className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {connectLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    <span>Connect Stripe</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-2xl p-5 shadow-sm border border-emerald-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Stripe Connected</p>
                <p className="text-sm text-gray-600">Payments transfer automatically</p>
              </div>
            </div>
            <button
              onClick={handleStripeConnect}
              className="text-sm text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Manage
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-shadow duration-300">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{displayEarnings.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">Total Earnings</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">{summary.totalPayments} payments</span>
            </div>
          </div>
        </div>

        {/* Transferred */}
        <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow duration-300">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Sent</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{displayTransferred.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">Transferred to Bank</p>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
                style={{ width: displayEarnings > 0 ? `${(displayTransferred / displayEarnings) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pending Transfer */}
        <div className="group relative bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-shadow duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{displayPending.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">Awaiting Transfer</p>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500" 
                style={{ width: displayPending > 0 ? '65%' : '0%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="group relative bg-gradient-to-br from-violet-50 via-white to-violet-50/30 p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-shadow duration-300">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-3 py-1 rounded-full">Expected</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{displayUpcoming.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">Upcoming Bookings</p>
            <div className="mt-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                    i < 3 ? 'bg-gradient-to-r from-violet-500 to-violet-600' : 'bg-gray-100'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 rounded-2xl p-5 shadow-sm border border-blue-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
        <div className="relative flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 mb-3">Payment Breakdown</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/60 rounded-xl p-3 border border-blue-100/50">
                <p className="text-xs text-gray-600 mb-1 font-medium">Total Received</p>
                <p className="text-xl font-bold text-gray-900">£{totalPaid.toFixed(2)}</p>
              </div>
              <div className="bg-white/60 rounded-xl p-3 border border-emerald-100/50">
                <p className="text-xs text-gray-600 mb-1 font-medium">Your Share (90%)</p>
                <p className="text-xl font-bold text-emerald-600">£{barberShareFromAppointments.toFixed(2)}</p>
              </div>
              <div className="bg-white/60 rounded-xl p-3 border border-gray-100/50">
                <p className="text-xs text-gray-600 mb-1 font-medium">Platform Fee (10%)</p>
                <p className="text-xl font-bold text-gray-600">£{platformFee.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-500 mt-0.5">Latest transactions and their status</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Your Share</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Transfer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                        <CreditCard className="w-12 h-12 text-gray-300" />
                      </div>
                      <p className="text-gray-900 font-semibold text-base">No payments yet</p>
                      <p className="text-sm text-gray-500 mt-2">Your transactions will appear here</p>
                    </td>
                  </tr>
                ) : (
                  payments.map(payment => (
                    <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-bold text-gray-700 border border-gray-200">
                            {payment.customerName?.charAt(0).toUpperCase() || 'G'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{payment.customerName || 'Guest'}</p>
                            <p className="text-xs text-gray-500">{payment.customerEmail || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">
                          {new Date(payment.createdAt).toLocaleDateString('en-GB', { 
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleTimeString('en-GB', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-base font-bold text-gray-900">
                          £{(payment.totalAmount || 0).toFixed(2)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-base font-bold text-emerald-600">
                          £{(payment.barberAmount || 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold">90% share</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          payment.status === 'succeeded' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : payment.status === 'failed'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {payment.status === 'succeeded' ? 'Paid' : 
                           payment.status === 'failed' ? 'Failed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          payment.transferStatus === 'completed' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                            : payment.transferStatus === 'failed'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : 'bg-gray-50 text-gray-700 border border-gray-100'
                        }`}>
                          {payment.transferStatus === 'completed' ? 'Sent' : 
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
    </div>
  );
}

export default PaymentsTab;