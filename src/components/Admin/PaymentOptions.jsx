import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Loader, AlertCircle } from 'lucide-react';

const PaymentOptions = ({ appointmentData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!stripe || !elements) {
    return (
      <div className="text-center py-12 bg-orange-50 rounded-xl border border-orange-300">
        <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
        <p className="font-bold text-orange-800">Loading payment system...</p>
      </div>
    );
  }

  const handleCardPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create PaymentIntent
      const res = await fetch(
        'https://barber-appointment-backend.vercel.app/api/payments/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalPrice: appointmentData.totalPrice,
            customerEmail: appointmentData.email,
            customerName: appointmentData.customerName,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Payment setup failed');
      }

      const { clientSecret, paymentIntentId } = await res.json();

      // 2. Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: appointmentData.customerName || 'Guest',
            email: appointmentData.email,
            phone: appointmentData.phone || undefined,
          },
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      // 3. Final booking
      const bookRes = await fetch(
        'https://barber-appointment-backend.vercel.app/api/payments/create-appointment-with-payment',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...appointmentData,
            paymentIntentId: paymentIntent.id,
            payOnline: true,
          }),
        }
      );

      if (!bookRes.ok) {
        const errBody = await bookRes.json().catch(() => ({}));
        throw new Error(errBody.error || errBody.details || 'Booking failed');
      }

      const result = await bookRes.json();
      onSuccess(result.appointment._id);

    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
      console.error('Payment/Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  const CARD_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#2d2d2d',
        '::placeholder': { color: '#aab7c4' },
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
        <CardElement options={CARD_OPTIONS} className="p-3 bg-gray-50 rounded-lg" />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-[#D4AF37] hover:bg-black hover:text-white text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader className="w-6 h-6 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-6 h-6" />
            Pay £{appointmentData.totalPrice.toFixed(2)} & Book
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-500 mt-4">
        Secured by <strong>Stripe</strong>
      </p>
    </form>
  );
};

export default PaymentOptions;