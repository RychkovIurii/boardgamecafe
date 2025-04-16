import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import Swal from '../utils/swalWithFont';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';


const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PUBLIC_KEY);

export const CheckoutForm = () => {
	const [searchParams] = useSearchParams();
	const bookingId = searchParams.get("bookingId");
	const fetchClientSecret = useCallback(() => {
	  return API.post("payment/create-checkout-session", {
		bookingId
	}).then((res) => res.data.clientSecret);
	}, [bookingId]);

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
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (!sessionId) {
        Swal.fire({
            icon: 'error',
            title: t('alerts.paymentErrorTitle'),
            text: t('alerts.paymentErrorText'),
            confirmButtonText: t('alerts.goHome'),
        }).then(() => {
            navigate('/');
        });
        return;
        }

    API.get(`payment/session-status?session_id=${sessionId}`)
      .then(res => {
        setStatus(res.data.status);
        setCustomerEmail(res.data.customer_email);
      })
      .catch((err) => {
        console.error('Error fetching session status:', err);
        Swal.fire({
          icon: 'error',
          title: t('alerts.paymentErrorTitle'),
          text: t('alerts.paymentErrorText'),
          confirmButtonText: t('alerts.goHome')
        }).then(() => navigate('/'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, t]);

  useEffect(() => {
    if (status === 'complete') {
      // Send payment confirmation email.
      API.post('/contact/send-payment-confirmation-email', {
        email: customerEmail,
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: t('alerts.paymentSuccessTitle'),
          text: `${t('alerts.paymentSuccessText')} ${customerEmail}`,
          confirmButtonText: t('alerts.goHome')
        }).then(() => {
          navigate('/');
        });
      })
      .catch((error) => {
        console.error('Error sending confirmation email:', error);
        Swal.fire({
          icon: 'error',
          title: t('alerts.emailErrorTitle'),
          text: t('alerts.emailErrorText'),
          confirmButtonText: t('alerts.goHome')
        }).then(() => {
          // Even if the email fails, navigate home.
          navigate('/');
        });
      });
    }
  }, [status, customerEmail, navigate, t]);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <CircularProgress />
        <h1 className="text-2xl mt-4">{t('alerts.paymentProcessing')}</h1>
        <p>{t('alerts.paymentProcessingText')}</p>
      </div>
    );
  }

  if (status === 'open') {
    return <Navigate to="/checkout" />;
  }

  return null;
};
