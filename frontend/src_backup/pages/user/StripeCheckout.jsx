import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ... other imports ...
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import UserNavbar from '../../components/common/UserNavbar';
import { createPaymentIntent, getBookingById, verifyPayment } from '../../services/api';
import './StripeCheckout.css';

// Initialize Stripe outside component to avoid re-creation
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

/* ==========================================
   SVG ICONS
   ========================================== */
const Icons = {
    Lock: ({ className = "" }) => (
        <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
    CreditCard: ({ className = "" }) => (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    ),
    Check: ({ className = "" }) => (
        <svg className={className} width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
    AlertCircle: ({ className = "" }) => (
        <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    Shield: ({ className = "" }) => (
        <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    )
};

/* ==========================================
   CHECKOUT FORM (inside Elements provider)
   ========================================== */
const CheckoutForm = ({ appointmentId, bookingInfo, paymentElementOptions }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            console.log("Stripe not ready");
            return;
        }

        const paymentElement = elements.getElement(PaymentElement);

        if (!paymentElement) {
            console.log("PaymentElement not mounted");
            return;
        }

        setProcessing(true);
        setError(null);

        const { error: stripeError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout?success=true&appointmentId=${appointmentId}`,
            },
        });

        // If we reach here, there was an error (successful payments redirect)
        if (stripeError) {
            setError(stripeError.message);
            setProcessing(false);
        }
    };



    return (
        <>
            {processing && (
                <div className="processing-overlay">
                    <div className="processing-spinner" />
                    <div className="processing-text">Processing Payment...</div>
                    <div className="processing-subtext">Please do not close this page</div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Order Summary */}
                {bookingInfo && (
                    <div className="order-summary">
                        <div className="summary-row">
                            <span>Services</span>
                            <span className="value">{bookingInfo.serviceNames || 'Service Appointment'}</span>
                        </div>
                        <div className="summary-row">
                            <span>Date</span>
                            <span className="value">{bookingInfo.date || '—'}</span>
                        </div>
                        <div className="summary-row">
                            <span>Time</span>
                            <span className="value">{bookingInfo.timeSlot || '—'}</span>
                        </div>
                        {bookingInfo.totalAmount && (
                            <div className="summary-row total">
                                <span>Total</span>
                                <span className="value">AUD {Number(bookingInfo.totalAmount).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="payment-error">
                        <Icons.AlertCircle />
                        {error}
                    </div>
                )}

                {/* Stripe Payment Element */}
                <div className="stripe-element-wrapper">
                    <PaymentElement options={paymentElementOptions} />
                </div>

                {/* Pay Button */}
                <button
                    type="submit"
                    className="pay-button"
                    disabled={!stripe || processing}
                >
                    {processing ? (
                        <>
                            <div className="btn-spinner" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Icons.Lock />
                            Pay AUD {Number(bookingInfo?.totalAmount || 0).toLocaleString()}
                        </>
                    )}
                </button>

                {/* Stripe badge */}
                <div className="stripe-badge">
                    <Icons.Shield />
                    Secured by Stripe
                </div>
            </form>
        </>
    );
};

/* ==========================================
   MAIN STRIPE CHECKOUT PAGE
   ========================================== */
const StripeCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Helper to format 24h time to 12h display
    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        return `${String(displayHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    const [clientSecret, setClientSecret] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookingInfo, setBookingInfo] = useState(null);

    // Payment return state
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [polling, setPolling] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const appointmentId = location.state?.appointmentId || searchParams.get('appointmentId');
    const isReturning = searchParams.get('success') === 'true';

    /* ------------------------------------------
       FETCH BOOKING INFO
       ------------------------------------------ */
    const fetchBookingInfo = useCallback(async (id) => {
        try {
            console.log("Fetching booking info for ID:", id);
            const response = await getBookingById(id);
            console.log("Booking info response:", response);

            if (response.success) {
                const b = response.data;
                console.log("Booking data:", b);
                setBookingInfo({
                    serviceNames: b.services?.map(s => s.serviceName).join(', ') || 'Service Appointment',
                    date: new Date(b.date).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    }),
                    timeSlot: `${formatTime(b.startTime)} - ${formatTime(b.endTime)}`,
                    totalAmount: b.totalAmount,
                    status: b.status,
                });
                return b.status;
            } else {
                console.error("Failed to fetch booking info:", response.message);
            }
            return null;
        } catch (err) {
            console.error("Error fetching booking info:", err);
            return null;
        }
    }, []);

    /* ------------------------------------------
       HANDLE RETURNING FROM STRIPE (redirect)
       ------------------------------------------ */
    useEffect(() => {
        if (!isReturning || !appointmentId) return;

        setPaymentSuccess(true);
        setPolling(true);
        setLoading(false);

        let attempts = 0;
        const maxAttempts = 20; // ~60 seconds

        const pollInterval = setInterval(async () => {
            attempts++;

            // Call the server-side verification endpoint which checks with Stripe API
            const verifyResult = await verifyPayment(appointmentId);
            if (verifyResult.success && verifyResult.data.status === 'CONFIRMED') {
                clearInterval(pollInterval);
                // Also refresh booking info for display
                await fetchBookingInfo(appointmentId);
                setConfirmed(true);
                setPolling(false);
            } else if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
                setPolling(false);
                // Even if not confirmed yet, show success
                setConfirmed(true);
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [isReturning, appointmentId, fetchBookingInfo]);

    /* ------------------------------------------
       INITIAL LOAD - Create Payment Intent
       ------------------------------------------ */
    const paymentInitialized = useRef(false);

    useEffect(() => {
        if (isReturning) return; // Skip if returning from Stripe
        if (paymentInitialized.current) return; // Prevent double call (React StrictMode)

        if (!appointmentId) {
            setError('No booking found. Please go back and try again.');
            setLoading(false);
            return;
        }

        paymentInitialized.current = true;

        const initializePayment = async () => {
            // Fetch booking details for display
            await fetchBookingInfo(appointmentId);

            // Create payment intent
            const response = await createPaymentIntent(appointmentId);

            if (response.success && response.data.clientSecret) {
                console.log("Client Secret:", response.data.clientSecret);
                setClientSecret(response.data.clientSecret);
                // Use amount from payment intent as reliable source
                if (response.data.amount) {
                    setBookingInfo(prev => ({
                        ...prev,
                        totalAmount: response.data.amount,
                    }));
                }
            } else {
                setError(response.message || 'Failed to initialize payment. Please try again.');
                paymentInitialized.current = false; // Allow retry on error
            }
            setLoading(false);
        };

        initializePayment();
    }, [appointmentId, isReturning, fetchBookingInfo]);

    /* ------------------------------------------
       STRIPE ELEMENTS OPTIONS
       ------------------------------------------ */
    const elementsOptions = useMemo(() => {
        if (!clientSecret) return null;

        return {
            clientSecret,
            appearance: {
                theme: 'night',
                labels: 'floating',
                // Temporarily simplified to debug 400 error
                /* 
                variables: {
                    colorPrimary: '#6366f1',
                    colorBackground: '#0f172a',
                    colorText: '#e2e8f0',
                    colorDanger: '#ef4444',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    borderRadius: '8px',
                    fontSizeBase: '14px',
                    spacingUnit: '4px',
                },
                rules: {
                    '.Input': {
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        boxShadow: 'none',
                        padding: '10px 12px',
                        fontSize: '14px',
                    },
                    '.Input:focus': {
                        border: '1px solid #6366f1',
                        boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.2)',
                    },
                    '.Label': {
                        color: '#94a3b8',
                        marginBottom: '6px',
                        fontSize: '13px',
                    },
                    '.Tab': {
                        border: '1px solid rgba(148, 163, 184, 0.15)',
                        backgroundColor: 'rgba(30, 41, 59, 0.5)',
                        padding: '8px 12px',
                    },
                    '.Tab--selected': {
                        border: '1px solid #6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    },
                },
                */
            },
        };
    }, [clientSecret]);

    // Memoize PaymentElement options
    const paymentElementOptions = useMemo(() => ({
        layout: {
            type: 'tabs',
            defaultCollapsed: false,
        },
        wallets: {
            applePay: 'auto',
            googlePay: 'auto',
        },
    }), []);

    /* ------------------------------------------
       RENDER
       ------------------------------------------ */

    // Success state (after returning from Stripe)
    if (paymentSuccess) {
        return (
            <div className="checkout-container">
                <UserNavbar />
                <div className="checkout-main">
                    <div className="checkout-card">
                        {polling && !confirmed ? (
                            <div className="checkout-loading">
                                <div className="processing-spinner" />
                                <p>Verifying your payment...</p>
                                <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                                    This may take a few seconds
                                </p>
                            </div>
                        ) : (
                            <div className="success-container">
                                <div className="success-icon-wrapper">
                                    <Icons.Check />
                                </div>
                                <h2>Payment Successful!</h2>
                                <p>Your booking has been confirmed. You can track it in My Bookings.</p>
                                <button
                                    className="success-btn"
                                    onClick={() => navigate('/my-bookings', { replace: true })}
                                >
                                    View My Bookings
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <UserNavbar />
            <div className="checkout-main">
                {/* Header */}
                <div className="checkout-header">
                    <h1>
                        <Icons.CreditCard />
                        Secure Payment
                    </h1>
                    <p>Complete your booking with a secure payment</p>
                </div>

                {/* Main Card */}
                <div className="checkout-card">
                    {loading ? (
                        <div className="checkout-loading">
                            <div className="processing-spinner" />
                            <p>Setting up payment...</p>
                        </div>
                    ) : error ? (
                        <div>
                            <div className="payment-error">
                                <Icons.AlertCircle />
                                {error}
                            </div>
                            <button
                                className="pay-button"
                                onClick={() => navigate('/my-bookings', { replace: true })}
                                style={{ marginTop: '16px' }}
                            >
                                Go to My Bookings
                            </button>
                        </div>
                    ) : clientSecret ? (
                        <Elements stripe={stripePromise} options={elementsOptions}>
                            <h2>
                                <Icons.CreditCard />
                                Payment Details
                            </h2>
                            <CheckoutForm
                                appointmentId={appointmentId}
                                bookingInfo={bookingInfo}
                                paymentElementOptions={paymentElementOptions}
                            />
                        </Elements>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default StripeCheckout;
