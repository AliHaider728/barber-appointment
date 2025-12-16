import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Loader, AlertCircle, Info } from 'lucide-react';

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
      // Create Payment Intent with barber ID for split payment
      const response = await fetch(
        'https://barber-appointment-backend.vercel.app/api/payments/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalPrice: appointmentData.totalPrice,
            customerEmail: appointmentData.email || 'no-email@temp.com',
            customerName: appointmentData.customerName || 'Guest',
            barberId: appointmentData.barber // IMPORTANT: For split payment
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create payment');
      }

      const { clientSecret, paymentIntentId, platformFee, barberAmount } = await response.json();

      console.log(`Payment split - Barber: £${barberAmount}, Platform: £${platformFee}`);

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
        // Create booking with payment
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
          
          if (bookRes.status === 409) {
            throw new Error('Time slot no longer available! Someone just booked it. Please select another time and try again.');
          } else if (bookRes.status === 400) {
            throw new Error(errorData.message || errorData.error || 'Invalid booking details. Please check and try again.');
          } else {
            throw new Error(errorData.error || errorData.message || 'Booking failed after payment. Please contact support with your payment confirmation.');
          }
        }

        const data = await bookRes.json();
        
        elements.getElement(CardElement)?.clear();
        
        onSuccess(data.appointment._id);
      }
    } catch (err) {
      setError(err.message || 'Payment failed. Please try again.');
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

  // Calculate split
  const barberAmount = appointmentData.totalPrice * 0.9;
  const platformFee = appointmentData.totalPrice * 0.1;

  return (
    <form onSubmit={handleCardPayment} className="mt-6">
      <div className="bg-white border-2 border-gray-300 rounded-xl p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="font-bold">Card Details</h3>
        </div>
        <CardElement options={CARD_STYLE} className="p-3 bg-gray-50 rounded-lg" />
      </div>

      {/* Payment Split Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-2">Payment Breakdown:</p>
            <div className="space-y-1 text-blue-800">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-bold">£{appointmentData.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Barber receives (90%):</span>
                <span className="font-bold text-green-600">£{barberAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee (10%):</span>
                <span className="font-medium">£{platformFee.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              The platform fee helps maintain the booking system and payment processing.
            </p>
          </div>
        </div>
      </div>

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

      <p className="text-center text-xs text-gray-500 mt-4">
        Safe & Secure - Powered by <strong>Stripe</strong> Payments
      </p>
      
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 text-center">
          Test Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
        </p>
      </div>
    </form>
  );
};

export default PaymentOptions;