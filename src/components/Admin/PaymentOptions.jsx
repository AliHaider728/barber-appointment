import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Loader } from 'lucide-react';

const PaymentOptions = ({ appointmentData, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCardPayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please wait.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create Payment Intent
      const intentResponse = await fetch('https://barber-appointment-backend.vercel.app/api/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalPrice: appointmentData.totalPrice,
          customerEmail: appointmentData.email,
          customerName: appointmentData.customerName
        })
      });

      if (!intentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await intentResponse.json();

      // Step 2: Confirm Card Payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: appointmentData.customerName,
            email: appointmentData.email,
            phone: appointmentData.phone
          }
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Step 3: Create Appointment with Payment
        const appointmentResponse = await fetch('https://barber-appointment-backend.vercel.app/api/payments/create-appointment-with-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...appointmentData,
            paymentIntentId: paymentIntent.id,
            payOnline: true
          })
        });

        if (!appointmentResponse.ok) {
          throw new Error('Booking failed after payment. Please contact support.');
        }

        const result = await appointmentResponse.json();
        
        // Success!
        onSuccess(result.appointment._id);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: 'system-ui, -apple-system, sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleCardPayment}>
        <div className="border-2 border-gray-300 rounded-lg p-4 mb-4 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-bold text-sm">Card Details</h3>
          </div>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full bg-[#D4AF37] text-black font-bold py-3 rounded-lg hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay £{appointmentData.totalPrice.toFixed(2)} & Book
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
           Secure payment powered by Stripe
        </p>
      </form>
    </div>
  );
};

export default PaymentOptions;