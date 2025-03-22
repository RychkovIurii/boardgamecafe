import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Navigate, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';


const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

export const CheckoutForm = () => {
	const fetchClientSecret = useCallback(() => {
	  return API.post("payment/create-checkout-session")
		.then((res) => res.data.clientSecret);
	}, []);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export const Return = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    API.get(`payment/session-status?session_id=${sessionId}`)
      .then(res => {
        setStatus(res.data.status);
        setCustomerEmail(res.data.customer_email);
      });
  }, []);

  useEffect(() => {
    if (status === 'complete') {
      Swal.fire({
        icon: 'success',
        title: 'Payment Complete!',
        text: `A confirmation email was sent to ${customerEmail}.`,
        confirmButtonText: 'Return to Home',
      }).then(() => {
        navigate('/');
      });
    }
  }, [status, customerEmail, navigate]);

  if (status === 'open') {
    return <Navigate to="/checkout" />;
  }

  return null;
};
