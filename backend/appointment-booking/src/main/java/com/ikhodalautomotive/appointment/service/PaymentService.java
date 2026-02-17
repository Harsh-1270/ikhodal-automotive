package com.ikhodalautomotive.appointment.service;

import java.math.BigDecimal;

public interface PaymentService {
    void validatePaymentEligibility(Long appointmentId);

    public BigDecimal calculateAppointmentAmount(Long appointmentId);

    String createPaymentIntent(Long appointmentId);

    /**
     * Verifies the payment status directly with Stripe API and updates the
     * database.
     * This is used as a fallback when webhooks are not available (e.g., localhost).
     * 
     * @return the updated appointment status
     */
    String verifyAndConfirmPayment(Long appointmentId);

}
