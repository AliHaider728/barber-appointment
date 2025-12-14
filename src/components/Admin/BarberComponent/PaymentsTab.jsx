import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, ExternalLink, CheckCircle, AlertCircle, Loader } from 'lucide-react';
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

  useEffect(() => {
    checkStripeStatus();
    fetchPayments();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    return { Authorization: `Bearer ${token}` };
  };

  const checkStripeStatus = async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/barbers/stripe/status`, { headers });
      setStripeStatus(res.data);
    } catch (err) {
      console.error('Stripe status error:', err);
      setStripeStatus({ connected: false });
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/barbers/payments`, { headers });
      
      setPayments(res.data.payments || []);
      setSummary(res.data.summary || {
        totalEarnings: 0,
        pendingAmount: 0,
        transferredAmount: 0,
        totalPayments: 0
      });
    } catch (err) {
      console.error('Fetch payments error:', err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStripeConnect = async () => {
    try {
      setConnectLoading(true);
      const headers = getAuthHeaders();
      const res = await axios.post(`${API_BASE}/barbers/stripe/connect`, {}, { headers });

      if (res.data.onboardingUrl) {
        window.location.href = res.data.onboardingUrl;
      } else if (res.data.loginUrl) {
        window.open(res.data.loginUrl, '_blank');
      }
    } catch (err) {
      console.error('Stripe connect error:', err);
      alert('Failed to connect Stripe: ' + (err.response?.data?.message || err.message));
    } finally {
      setConnectLoading(false);
    }
  };

  // Calculate from appointments
  const paidAppointments = appointments.filter(apt => apt.paymentStatus === 'paid');
  const pendingAppointments = appointments.filter(apt => apt.paymentStatus === 'pending');
  
  const totalPaid = paidAppointments.reduce((sum, apt) => sum + apt.totalPrice, 0);
  const totalPending = pendingAppointments.reduce((sum, apt) => sum + apt.totalPrice, 0);

  // Calculate barber's share (90%)
  const barberShare = totalPaid * 0.9;
  const platformFee = totalPaid * 0.1;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-12 h-12 animate-spin text-[#D4AF37]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stripe Connect Banner */}
      {!stripeStatus?.connected && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Connect Your Stripe Account
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Connect your Stripe account to receive payments directly to your bank account. 
                You will get 90% of each booking payment, and the platform keeps 10% as service fee.
              </p>
              <button
                onClick={handleStripeConnect}
                disabled={connectLoading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {connectLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4" />
                    Connect Stripe Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {stripeStatus?.connected && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-bold text-gray-800">Stripe Connected</h3>
          </div>
          <p className="text-gray-600 text-sm mb-3">
            Your Stripe account is connected. Payments will be automatically transferred to your bank account.
          </p>
          <button
            onClick={handleStripeConnect}
            className="text-green-700 font-medium text-sm hover:text-green-800 flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Manage Stripe Dashboard
          </button>
        </div>
      )}

      {/* Payment Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">Your Share</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{barberShare.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">Your Earnings (90%)</p>
            <div className="mt-4 flex items-center gap-2 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-semibold">{paidAppointments.length} payments</span>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-amber-50 via-white to-amber-50/30 p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Pending</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{(totalPending * 0.9).toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">Awaiting Payment</p>
            <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-blue-50 via-white to-blue-50/30 p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{totalPaid.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">All Received</p>
            <div className="mt-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i < 4 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gray-100'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Fee Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Payment Breakdown:</p>
            <ul className="space-y-1 text-blue-700">
              <li>Total Received: £{totalPaid.toFixed(2)}</li>
              <li>Your Share (90%): £{barberShare.toFixed(2)}</li>
              <li>Platform Fee (10%): £{platformFee.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-500 mt-0.5">All transaction records</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Your Share</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.filter(apt => apt.paymentStatus).length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="inline-flex p-4 bg-gray-50 rounded-2xl mb-4">
                      <CreditCard className="w-12 h-12 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-medium">No payments found</p>
                    <p className="text-sm text-gray-400 mt-1">Payments will appear here once customers pay online</p>
                  </td>
                </tr>
              ) : (
                appointments
                  .filter(apt => apt.paymentStatus)
                  .map(apt => {
                    const barberAmount = apt.totalPrice * 0.9;
                    return (
                      <tr key={apt._id} className="hover:bg-gray-50/50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-bold text-gray-700 border border-gray-200 flex-shrink-0">
                              {apt.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{apt.customerName}</p>
                              <p className="text-xs text-gray-500">{apt.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">{new Date(apt.date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{new Date(apt.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-base font-bold text-gray-900">£{apt.totalPrice.toFixed(2)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-base font-bold text-green-600">£{barberAmount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">90% of total</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-block ${
                            apt.paymentStatus === 'paid' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {apt.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PaymentsTab;