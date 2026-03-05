import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";

// ... other imports ...
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import UserNavbar from "../../components/common/UserNavbar";
import {
  createPaymentIntent,
  getBookingById,
  verifyPayment,
  clearCart,
  cancelBooking,
} from "../../services/api";
import "./StripeCheckout.css";

// Initialize Stripe outside component to avoid re-creation
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

/* ==========================================
   SVG ICONS
   ========================================== */
const Icons = {
  Lock: ({ className = "" }) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  CreditCard: ({ className = "" }) => (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Check: ({ className = "" }) => (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertCircle: ({ className = "" }) => (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fca5a5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Shield: ({ className = "" }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#64748b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Calendar: ({ className = "" }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: ({ className = "" }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Wrench: ({ className = "" }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  DollarSign: ({ className = "" }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  ArrowRight: ({ className = "" }) => (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Receipt: ({ className = "" }) => (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  ),
};

/* ==========================================
   STEP INDICATOR
   ========================================== */
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { label: "Booking", id: 1 },
    { label: "Payment", id: 2 },
    { label: "Confirmed", id: 3 },
  ];

  return (
    <div className="checkout-steps">
      {steps.map((step, idx) => {
        const status =
          step.id < currentStep
            ? "done"
            : step.id === currentStep
              ? "active"
              : "pending";
        return (
          <React.Fragment key={step.id}>
            <div className="step-item">
              <div className={`step-circle ${status}`}>
                {status === "done" ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <span className={`step-label ${status}`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`step-connector ${status === "done" ? "done" : ""}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ==========================================
   CHECKOUT FORM (inside Elements provider)
   ========================================== */
const CheckoutForm = ({
  appointmentId,
  bookingInfo,
  paymentElementOptions,
}) => {
  const stripe = useStripe();
  const elements = useElements();
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
          <div className="processing-content">
            <div className="processing-spinner" />
            <div className="processing-text">Processing Payment...</div>
            <div className="processing-subtext">
              Please do not close this page
            </div>
          </div>
        </div>
      )}

      {/* Left panel — Order Summary (desktop: sticky left column) */}
      <div className="order-summary-panel">
        {bookingInfo && (
          <>
            <h3 className="order-summary-panel-title">
              <Icons.Receipt />
              Order Summary
            </h3>
            <div className="order-summary">
              <div className="order-summary-header">
                <div className="order-summary-title">Booking Details</div>
                {/* <div className="order-summary-icon">
                                    <Icons.Receipt />
                                </div> */}
              </div>
              <div className="summary-row summary-row--services">
                <span className="label">
                  <Icons.Wrench />
                  Services
                </span>
                <div className="service-tag-list">
                  {(
                    bookingInfo.serviceList || [
                      bookingInfo.serviceNames || "Service Appointment",
                    ]
                  ).map((name, i) => (
                    <span key={i} className="service-tag">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="summary-row">
                <span className="label">
                  <Icons.Calendar />
                  Date
                </span>
                <span className="value">{bookingInfo.date || "—"}</span>
              </div>
              <div className="summary-row">
                <span className="label">
                  <Icons.Clock />
                  Time
                </span>
                <span className="value">{bookingInfo.timeSlot || "—"}</span>
              </div>
              {bookingInfo.totalAmount && (
                <div className="summary-row total">
                  <span className="label">
                    <Icons.DollarSign />
                    Total Due
                  </span>
                  <span className="value">
                    AUD {Number(bookingInfo.totalAmount).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right panel — Payment Form */}
      <div className="payment-panel">
        <form onSubmit={handleSubmit}>
          {/* Payment panel heading */}
          <h2>
            <Icons.CreditCard />
            Payment Details
          </h2>
          {error && (
            <div className="payment-error">
              <Icons.AlertCircle />
              <span>{error}</span>
            </div>
          )}

          {/* Section divider */}
          <div className="section-divider">
            <div className="section-divider-line" />
            <span className="section-divider-text">Payment Method</span>
            <div className="section-divider-line" />
          </div>

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
                Pay&nbsp;
                <span className="pay-button-amount">
                  AUD {Number(bookingInfo?.totalAmount || 0).toLocaleString()}
                </span>
                <Icons.ArrowRight />
              </>
            )}
          </button>

          {/* Footer security info */}
          <div className="payment-footer">
            <div className="payment-footer-item">
              <Icons.Shield />
              SSL Encrypted
            </div>
            <div className="payment-footer-dot" />
            <div className="payment-footer-item">
              <Icons.Lock />
              256-bit Secure
            </div>
            <div className="payment-footer-dot" />
            <div className="payment-footer-item">Powered by Stripe</div>
          </div>
        </form>
      </div>
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
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${String(displayHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
  };

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingInfo, setBookingInfo] = useState(null);

  // Payment return state
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [polling, setPolling] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const appointmentId =
    location.state?.appointmentId || searchParams.get("appointmentId");
  const isReturning = searchParams.get("success") === "true";

  // Handle browser back button - cancel booking + PaymentIntent, restart from Schedule
  useEffect(() => {
    if (paymentSuccess) return; // Don't intercept back on the success screen

    const handlePopState = async (e) => {
      e.preventDefault();
      // Cancel the pending booking and Stripe PaymentIntent on the backend
      if (appointmentId) {
        await cancelBooking(appointmentId);
      }
      // Send user back to Schedule to restart the entire booking flow
      navigate("/schedule", { replace: true });
    };

    // Add a history entry to intercept the back button
    window.history.pushState(null, "", window.location.href);

    // Listen for back button
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, paymentSuccess, appointmentId]);

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
          serviceNames:
            b.services?.map((s) => s.serviceName).join(", ") ||
            "Service Appointment",
          serviceList: b.services?.map((s) => s.serviceName) || [
            "Service Appointment",
          ],
          date: new Date(b.date).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "short",
            year: "numeric",
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
      if (verifyResult.success && verifyResult.data.status === "CONFIRMED") {
        clearInterval(pollInterval);
        // Refresh booking info for the success screen
        await fetchBookingInfo(appointmentId);
        // Clear the cart after confirmed payment
        try {
          await clearCart();
        } catch (_) {}
        setConfirmed(true);
        setPolling(false);
      } else if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        // Clear cart even if not yet confirmed (payment was charged)
        try {
          await clearCart();
        } catch (_) {}
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
      setError(
        "No booking found. Please go back to the schedule and start your booking again.",
      );
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
          setBookingInfo((prev) => ({
            ...prev,
            totalAmount: response.data.amount,
          }));
        }
      } else {
        setError(
          response.message ||
            "We couldn't initialise the payment. Please go back and try booking again.",
        );
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
        theme: "night",
        labels: "floating",
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#0f172a",
          colorText: "#e2e8f0",
          colorDanger: "#ef4444",
          fontFamily: "Inter, system-ui, sans-serif",
          borderRadius: "10px",
          fontSizeBase: "14px",
          spacingUnit: "4px",
        },
        rules: {
          ".Input": {
            border: "1px solid rgba(148, 163, 184, 0.18)",
            boxShadow: "none",
            padding: "11px 14px",
            fontSize: "14px",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
          },
          ".Input:focus": {
            border: "1px solid #6366f1",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.15)",
          },
          ".Label": {
            color: "#94a3b8",
            marginBottom: "6px",
            fontSize: "13px",
          },
          ".Tab": {
            border: "1px solid rgba(148, 163, 184, 0.12)",
            backgroundColor: "rgba(30, 41, 59, 0.5)",
            padding: "8px 12px",
          },
          ".Tab--selected": {
            border: "1px solid #6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            boxShadow: "0 0 0 1px #6366f1",
          },
          ".Tab:hover": {
            backgroundColor: "rgba(99, 102, 241, 0.06)",
          },
        },
      },
    };
  }, [clientSecret]);

  // Memoize PaymentElement options
  const paymentElementOptions = useMemo(
    () => ({
      layout: {
        type: "tabs",
        defaultCollapsed: false,
      },
      wallets: {
        applePay: "auto",
        googlePay: "auto",
      },
    }),
    [],
  );

  /* ------------------------------------------
       RENDER
       ------------------------------------------ */

  // Success state (after returning from Stripe)
  if (paymentSuccess) {
    return (
      <div className="checkout-container">
        <div className="checkout-glow-1" />
        <div className="checkout-glow-2" />
        <UserNavbar />
        <div className="checkout-main">
          <StepIndicator currentStep={confirmed ? 3 : 2} />
          <div className="checkout-card checkout-card--centered">
            {polling && !confirmed ? (
              <div className="checkout-loading">
                <div className="processing-spinner" />
                <p>Verifying your payment...</p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginTop: "8px",
                  }}
                >
                  This may take a few seconds
                </p>
              </div>
            ) : (
              <div className="success-container">
                <div className="success-icon-wrapper">
                  <Icons.Check />
                </div>
                <h2>Payment Successful!</h2>
                {bookingInfo?.totalAmount && (
                  <div className="success-amount">
                    AUD {Number(bookingInfo.totalAmount).toLocaleString()}
                  </div>
                )}
                <p>
                  Your booking has been confirmed. You can track it in My
                  Bookings.
                </p>

                {bookingInfo && (
                  <div className="success-details">
                    {bookingInfo.serviceNames && (
                      <div className="success-detail-row">
                        <span>Service</span>
                        <span className="value">
                          {bookingInfo.serviceNames}
                        </span>
                      </div>
                    )}
                    {bookingInfo.date && (
                      <div className="success-detail-row">
                        <span>Date</span>
                        <span className="value">{bookingInfo.date}</span>
                      </div>
                    )}
                    {bookingInfo.timeSlot && (
                      <div className="success-detail-row">
                        <span>Time</span>
                        <span className="value">{bookingInfo.timeSlot}</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  className="success-btn"
                  onClick={() => navigate("/my-bookings", { replace: true })}
                >
                  View My Bookings
                  <Icons.ArrowRight />
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
      <div className="checkout-glow-1" />
      <div className="checkout-glow-2" />
      <div className="checkout-glow-3" />
      <UserNavbar />
      <div className="checkout-main">
        {/* Header */}
        <div className="checkout-header">
          <div className="checkout-brand-pill">
            <Icons.Shield />
            Secure Checkout
          </div>
          <h1>
            <Icons.CreditCard />
            Secure Payment
          </h1>
          <p>Complete your booking with a secure, encrypted payment</p>
          <div className="checkout-trust-row">
            <span className="trust-badge">
              <Icons.Shield />
              SSL Encrypted
            </span>
            <span className="trust-badge">
              <Icons.Lock />
              256-bit Secure
            </span>
            <span className="trust-badge">
              <Icons.Shield />
              Powered by Stripe
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={2} />

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
                <span>{error}</span>
              </div>
              <button
                className="pay-button"
                onClick={() => navigate("/my-bookings", { replace: true })}
                style={{ marginTop: "16px" }}
              >
                Go to My Bookings
              </button>
            </div>
          ) : clientSecret ? (
            <Elements stripe={stripePromise} options={elementsOptions}>
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
