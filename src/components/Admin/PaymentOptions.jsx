// src/components/PaymentOptions.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle } from 'lucide-react';

const PaymentOptions = ({ appointmentData, onBookFree, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayOnline = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Step 1: Create appointment
      const res = await fetch('https://barber-appointment-backend.vercel.app/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...appointmentData, payOnline: true })
      });

      if (!res.ok) throw new Error('Booking failed');
      const appointment = await res.json();

      // Step 2: Create Payment Intent
      const intentRes = await fetch('https://barber-appointment-backend.vercel.app/api/stripe/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId: appointment._id })
      });

      const { clientSecret } = await intentRes.json();

      // Step 3: Confirm Payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess(appointment._id);
      }
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-5 bg-gradient-to-br from-yellow-50 to-white rounded-xl border-2 border-[#D4AF37]/20">
      <h3 className="font-black text-lg mb-4 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-[#D4AF37]" />
        Payment Options
      </h3>

      <div className="mb-4 p-4 bg-white rounded-lg border-2 border-gray-200">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#000',
                '::placeholder': { color: '#aab7c4' },
              },
            },
          }}
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-3 flex items-center gap-1">
          <span>✗</span> {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onBookFree}
          disabled={loading}
          className="py-3 px-4 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
        >
          Book Free
          <span className="text-xs">(Pay at Shop)</span>
        </button>

        <button
          onClick={handlePayOnline}
          disabled={loading || !stripe}
          className="py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            'Processing...'
          ) : (
            <>
              Pay £{appointmentData.totalPrice.toFixed(2)}
              <CheckCircle className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Test Card: <code className="bg-gray-100 px-1 rounded">4242 4242 4242 4242</code>
      </p>
    </div>
  );
};

export default PaymentOptions;