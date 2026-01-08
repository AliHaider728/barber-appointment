import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, CreditCard, ExternalLink, CheckCircle, 
  AlertCircle, Loader, Clock, RefreshCw, Building2, Send, Settings,
  Plus, Trash2, Star, Check, X, Info
} from 'lucide-react';
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
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
 
  // Bank account management
  const [showBankModal, setShowBankModal] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [deletingBank, setDeletingBank] = useState(null);
  
  // Add bank form
  const [bankForm, setBankForm] = useState({
    accountHolderName: '',
    accountNumber: '',
    sortCode: '',
    setAsDefault: true
  });
  const [addingBank, setAddingBank] = useState(false);

  useEffect(() => {
    loadData();
  }, [appointments]);

  useEffect(() => {
    if (stripeStatus?.connected) {
      loadBankAccounts();
    }
  }, [stripeStatus]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      console.error('No auth token found');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  const loadData = async () => {
    setError(null);
    await Promise.all([
      checkStripeStatus(),
      fetchPayments()
    ]);
  };

  const checkStripeStatus = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) {
        setStripeStatus({ connected: false, error: 'Not authenticated' });
        return;
      }
      const res = await axios.get(`${API_BASE}/payments/stripe/status`, {
        headers,
        timeout: 15000
      });
     
      setStripeStatus(res.data);
    } catch (err) {
      console.error('Stripe status error:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setStripeStatus({
        connected: false,
        error: errorMsg
      });
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeaders();
      if (!headers) {
        setPayments([]);
        setSummary({
          totalEarnings: 0,
          pendingAmount: 0,
          transferredAmount: 0,
          totalPayments: 0
        });
        setLoading(false);
        return;
      }
      const res = await axios.get(`${API_BASE}/payments/barber/me`, {
        headers,
        timeout: 15000
      });
     
      const fetchedPayments = res.data.payments || [];
      const fetchedSummary = res.data.summary || {
        totalEarnings: 0,
        pendingAmount: 0,
        transferredAmount: 0,
        totalPayments: 0
      };
      setPayments(fetchedPayments);
      setSummary(fetchedSummary);
     
    } catch (err) {
      console.error('Fetch payments error:', err);
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

  const handleStripeConnect = async () => {
    if (connectLoading) return;
   
    try {
      setConnectLoading(true);
      setError(null);
     
      const headers = getAuthHeaders();
      if (!headers) {
        throw new Error('Not authenticated - please login again');
      }
     
      const res = await axios.post(`${API_BASE}/payments/stripe/connect`, {}, {
        headers,
        timeout: 30000
      });
     
      if (res.data.needsOnboarding) {
        // Create onboarding link
        const linkRes = await axios.post(`${API_BASE}/payments/stripe/onboarding-link`, {}, {
          headers,
          timeout: 15000
        });
        
        if (linkRes.data.url) {
          window.location.href = linkRes.data.url;
        }
      } else {
        setSuccess('Stripe account already connected!');
        await checkStripeStatus();
      }
    } catch (err) {
      console.error('Stripe connect error:', err);
     
      let errorMsg = 'Failed to connect Stripe';
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }
     
      setError(errorMsg);
    } finally {
      setConnectLoading(false);
    }
  };
 
  const loadBankAccounts = async () => {
    try {
      setLoadingBanks(true);
      const headers = getAuthHeaders();
      if (!headers) return;
      const res = await axios.get(`${API_BASE}/payments/stripe/bank-accounts`, {
        headers,
        timeout: 15000
      });
     
      setBankAccounts(res.data.bankAccounts || []);
    } catch (err) {
      console.error('Load banks error:', err);
      setError('Failed to load bank accounts');
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleAddBank = async (e) => {
    e.preventDefault();
    if (addingBank) return;
    
    try {
      setAddingBank(true);
      setError(null);
      
      const headers = getAuthHeaders();
      if (!headers) throw new Error('Not authenticated');
      
      const res = await axios.post(
        `${API_BASE}/payments/stripe/add-bank-account`,
        bankForm,
        { headers, timeout: 15000 }
      );
      
      setSuccess('Bank account added successfully!');
      setBankForm({
        accountHolderName: '',
        accountNumber: '',
        sortCode: '',
        setAsDefault: true
      });
      setShowAddBankModal(false);
      await loadBankAccounts();
      
    } catch (err) {
      console.error('Add bank error:', err);
      setError(err.response?.data?.details || err.response?.data?.error || 'Failed to add bank account');
    } finally {
      setAddingBank(false);
    }
  };

  const handleDeleteBank = async (bankId) => {
    if (!window.confirm('Are you sure you want to remove this bank account?')) return;
    
    try {
      setDeletingBank(bankId);
      const headers = getAuthHeaders();
      if (!headers) throw new Error('Not authenticated');
      
      await axios.delete(
        `${API_BASE}/payments/stripe/bank-accounts/${bankId}`,
        { headers, timeout: 15000 }
      );
      
      setSuccess('Bank account removed');
      await loadBankAccounts();
      
    } catch (err) {
      console.error('Delete bank error:', err);
      setError('Failed to remove bank account');
    } finally {
      setDeletingBank(null);
    }
  };

  const handleSetDefaultBank = async (bankId) => {
    try {
      const headers = getAuthHeaders();
      if (!headers) throw new Error('Not authenticated');
      
      await axios.put(
        `${API_BASE}/payments/stripe/bank-accounts/${bankId}/default`,
        {},
        { headers, timeout: 15000 }
      );
      
      setSuccess('Default bank account updated');
      await loadBankAccounts();
      
    } catch (err) {
      console.error('Set default error:', err);
      setError('Failed to set default bank');
    }
  };

  const handleTransferPending = async () => {
    if (transferring) return;
   
    if (!window.confirm(`Transfer £${summary.pendingAmount.toFixed(2)} to your bank account?`)) {
      return;
    }
    try {
      setTransferring(true);
      setError(null);
     
      const headers = getAuthHeaders();
      if (!headers) {
        throw new Error('Not authenticated');
      }
      const res = await axios.post(
        `${API_BASE}/payments/stripe/transfer-pending`,
        {},
        { headers, timeout: 30000 }
      );
      setSuccess(res.data.message || 'Transfer initiated successfully!');
      await loadData();
    } catch (err) {
      console.error('Transfer error:', err);
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
    } finally {
      setTransferring(false);
    }
  };

  const handleManageAccount = async () => {
    try {
      const headers = getAuthHeaders();
      if (!headers) return;
      const res = await axios.post(
        `${API_BASE}/payments/stripe/dashboard-link`,
        {},
        { headers, timeout: 15000 }
      );
      if (res.data.url) {
        window.open(res.data.url, '_blank');
      }
    } catch (err) {
      console.error('Dashboard link error:', err);
      setError('Failed to open Stripe dashboard');
    }
  };

  const paidAppointments = appointments.filter(apt => apt.paymentStatus === 'paid');
  const pendingAppointments = appointments.filter(apt => apt.paymentStatus === 'pending');
 
  const totalPaid = paidAppointments.reduce((sum, apt) => sum + (apt.totalPrice || 0), 0);
  const totalPending = pendingAppointments.reduce((sum, apt) => sum + (apt.totalPrice || 0), 0);
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
          <p className="text-sm text-gray-500 mt-1">Manage your payments and bank transfers</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-emerald-900">Success</p>
            <p className="text-sm text-emerald-700 mt-1">{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stripe Connect Banner */}
      {!stripeStatus?.connected ? (
        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Bank Account</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Link your bank account to receive payments directly. You earn 90% of every booking.
              </p>
              {stripeStatus?.error && (
                <p className="text-xs text-red-600 mb-3 font-medium">
                  {stripeStatus.error}
                </p>
              )} 
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
                    <Building2 className="w-4 h-4" />
                    <span>Connect Bank Account</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="group relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30 rounded-2xl p-5 shadow-sm border border-emerald-100 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Bank Account Connected ✓</p>
                <p className="text-sm text-gray-600">
                  {stripeStatus.fullyOnboarded
                    ? 'Ready to receive payments'
                    : 'Complete setup to receive payments'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBankModal(true)}
                className="text-sm text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Building2 className="w-4 h-4" />
                Manage Banks
              </button>
              <button
                onClick={handleManageAccount}
                className="text-sm text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <ExternalLink className="w-4 h-4" />
                Stripe Dashboard
              </button>
            </div>
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
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/30">
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
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Received</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{displayTransferred.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium">In Your Bank</p>
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
              <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Awaiting</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">£{displayPending.toFixed(2)}</h3>
            <p className="text-sm text-gray-600 font-medium mb-3">Ready to Transfer</p>
           
            {stripeStatus?.fullyOnboarded && displayPending > 0 ? (
              <button
                onClick={handleTransferPending}
                disabled={transferring}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {transferring ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Transfer Now</span>
                  </>
                )}
              </button>
            ) : (
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                  style={{ width: displayPending > 0 ? '65%' : '0%' }}
                ></div>
              </div>
            )}
          </div>
        </div>
 
        {/* Upcoming */}
        <div className="group relative bg-gradient-to-br from-violet-50 via-white to-violet-50/30 p-6 rounded-2xl shadow-sm border border-violet-100 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/10 to-transparent rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/30">
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

      {/* Payment History */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/60 overflow-hidden">
        <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
              <p className="text-sm text-gray-500 mt-0.5">Latest transactions and their status</p>
            </div>
            <button
              onClick={async () => {
                setRefreshing(true);
                await loadData();
                setRefreshing(false);
              }}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {payment.transferStatus === 'completed' ? 'Transferred' :
                           payment.transferStatus === 'failed' ? 'Failed' : 'Awaiting'}
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

      {/* Bank Accounts Modal */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Bank Accounts</h3>
              <button
                onClick={() => setShowBankModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingBanks ? (
              <div className="flex justify-center py-8">
                <Loader className="w-8 h-8 animate-spin text-gray-900" />
              </div>
            ) : bankAccounts.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No bank accounts added yet</p>
                <button
                  onClick={() => {
                    setShowBankModal(false);
                    setShowAddBankModal(true);
                  }}
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition"
                >
                  Add Bank Account
                </button>
              </div>
            ) : (
              <>
                <ul className="space-y-3 mb-6">
                  {bankAccounts.map((bank) => (
                    <li
                      key={bank.id}
                      className="flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-semibold text-gray-900">{bank.bank_name || 'Bank Account'}</p>
                          <p className="text-sm text-gray-600">
                            Sort Code: {bank.routing_number} • Account: ****{bank.last4}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {bank.default_for_currency ? (
                          <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-emerald-700" />
                            Default
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultBank(bank.id)}
                            className="text-xs text-gray-600 hover:text-gray-900 font-semibold px-2 py-1 rounded hover:bg-gray-100"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBank(bank.id)}
                          disabled={deletingBank === bank.id}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingBank === bank.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setShowBankModal(false);
                    setShowAddBankModal(true);
                  }}
                  className="w-full bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Bank
                </button>
              </>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleManageAccount}
                className="text-sm text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Advanced Settings (Stripe Dashboard)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Modal */}
      {showAddBankModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Bank Account</h3>
              <button
                onClick={() => setShowAddBankModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBank} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={bankForm.accountHolderName}
                  onChange={(e) => setBankForm({...bankForm, accountHolderName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="John Smith"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort Code (6 digits)
                </label>
                <input
                  type="text"
                  value={bankForm.sortCode}
                  onChange={(e) => setBankForm({...bankForm, sortCode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="12-34-56"
                  maxLength="8"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Format: 12-34-56 or 123456</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Number (8 digits)
                </label>
                <input
                  type="text"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 8)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="12345678"
                  maxLength="8"
                  required
                />
              </div>

              <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  For testing, use Stripe's test bank account:<br/>
                  Sort Code: <strong>108800</strong><br/>
                  Account: <strong>00012345</strong>
                </p>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bankForm.setAsDefault}
                  onChange={(e) => setBankForm({...bankForm, setAsDefault: e.target.checked})}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="text-sm text-gray-700">Set as default bank account</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBankModal(false)}
                  className="flex-1 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={addingBank}
                  className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingBank ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Add Bank</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsTab;