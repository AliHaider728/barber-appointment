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
      console.log('🎯 Starting payment process...');
      console.log('📝 Appointment data:', {
        totalPrice: appointmentData.totalPrice,
        barberId: appointmentData.barber,
        customerName: appointmentData.customerName
      });

      // STEP 1: Create Payment Intent
      console.log('1️⃣ Creating payment intent...');
      const response = await fetch(
        'https://barber-appointment-backend.vercel.app/api/payments/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalPrice: appointmentData.totalPrice,
            customerEmail: appointmentData.email || 'no-email@temp.com',
            customerName: appointmentData.customerName || 'Guest',
            barberId: appointmentData.barber
          }),
        }
      ); 

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId, platformFee, barberAmount } = await response.json();
      console.log('✅ Payment intent created:', paymentIntentId);
      console.log('💰 Barber will receive: £' + barberAmount);

      // STEP 2: Confirm Payment with Stripe
      console.log('2️⃣ Confirming payment with Stripe...');
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
        console.error('❌ Payment failed:', result.error.message);
        throw new Error(result.error.message);
      }

      console.log('✅ Payment succeeded:', result.paymentIntent.id);
      console.log('💳 Status:', result.paymentIntent.status);

      // STEP 3: Create Booking with Payment
      if (result.paymentIntent.status === 'succeeded') {
        console.log('3️⃣ Creating booking with payment...');
        
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

        if (!bookRes.ok) {
          const errorData = await bookRes.json();
          console.error('❌ Booking failed:', errorData);
          
          if (bookRes.status === 409) {
            throw new Error('Time slot no longer available! Someone just booked it. Please select another time.');
          } else if (bookRes.status === 400) {
            throw new Error(errorData.message || errorData.error || 'Invalid booking details.');
          } else {
            throw new Error(errorData.error || errorData.message || 'Booking failed. Please contact support.');
          }
        }

        const data = await bookRes.json();
        console.log('✅ Booking created:', data.appointment._id);
        
        // Clear card input
        elements.getElement(CardElement)?.clear();
        
        // Success!
        onSuccess(data.appointment._id);
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
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
      {/* Card Input */}
      <div className="bg-white border-2 border-gray-300 rounded-xl p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold text-gray-900">Card Details</h3>
        </div>
        <CardElement options={CARD_STYLE} className="p-3 bg-gray-50 rounded-lg" />
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-700 mb-1">Payment Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pay Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#D4AF37] hover:bg-black hover:text-white text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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

      {/* Footer Info */}
      <p className="text-center text-xs text-gray-500 mt-4">
       Safe & Secure - Powered by <strong>Stripe</strong>
      </p>
      
      
    </form>
  );
};

export default PaymentOptions;