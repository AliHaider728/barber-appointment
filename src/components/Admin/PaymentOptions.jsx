// src/components/PaymentOptions.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Loader, AlertCircle } from 'lucide-react';

const PaymentOptions = ({ appointmentData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Agar Stripe load nahi hua to graceful fallback
  if (!stripe || !elements) {
    return (
      <div className="text-center py-10 bg-orange-50 rounded-xl border-2 border-orange-200">
        <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <p className="font-bold text-orange-700">Payment system loading...</p>
        <p className="text-sm text-gray-600 mt-2">Please wait or refresh the page.</p>
      </div>
    );
  }

  const handleCardPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create Payment Intent
      const response = await fetch(
        'https://barber-appointment-backend.vercel.app/api/payments/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalPrice: appointmentData.totalPrice,
            customerEmail: appointmentData.email || 'no-email@temp.com',
            customerName: appointmentData.customerName || 'Guest',
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create payment');
      }

      const { clientSecret, paymentIntentId } = await response.json();

      // Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: appointmentData.customerName || 'Guest',
            email: appointmentData.email || 'no-email@temp.com',
            phone: appointmentData.phone || null,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        // Final booking
        const bookRes = await fetch(
          'https://barber-appointment-backend.vercel.app/api/payments/create-appointment-with-payment',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...appointmentData,
              paymentIntentId: result.paymentIntent.id,
              payOnline: true,
            }),
          }
        );

        if (!bookRes.ok) throw new Error('Booking failed after payment');
        const data = await bookRes.json();
        onSuccess(data.appointment._id);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const CARD_STYLE = {
    style: {
      base: {
        fontSize: '16px',
        color: '#2d2d2d',
        fontFamily: 'system-ui, sans-serif',
        '::placeholder': { color: '#a0a0a0' },
      },
      invalid: { color: '#e5424d' },
    },
  };

  return (
    <form onSubmit={handleCardPayment} className="mt-6">
      <div className="bg-white border-2 border-gray-300 rounded-xl p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold">Card Details</h3>
        </div>
        <CardElement options={CARD_STYLE} className="p-3 bg-gray-50 rounded-lg" />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D4AF37] hover:bg-black hover:text-white text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader className="w-6 h-6 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-6 h-6" />
            Pay £{appointmentData.totalPrice.toFixed(2)} & Book Now
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500 mt-4">
        Secured by <strong>Stripe</strong> • 256-bit encryption
      </p>
    </form>
  );
};

export default PaymentOptions;