package com.ikhodalautomotive.appointment.service;

import java.math.BigDecimal;

public interface PaymentService {
    void validatePaymentEligibility(Long appointmentId);

    public BigDecimal calculateAppointmentAmount(Long appointmentId);

    String createPaymentIntent(Long appointmentId);
}
