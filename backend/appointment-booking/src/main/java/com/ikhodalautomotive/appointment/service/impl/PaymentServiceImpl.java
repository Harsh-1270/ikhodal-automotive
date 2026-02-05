package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.enums.PaymentStatus;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.AppointmentService;
import com.ikhodalautomotive.appointment.model.Payment;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentServiceRepository;
import com.ikhodalautomotive.appointment.repository.PaymentRepository;
import com.ikhodalautomotive.appointment.service.PaymentService;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import static com.ikhodalautomotive.appointment.constants.AppointmentStatusConstants.PENDING;

import java.math.BigDecimal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final AppointmentServiceRepository appointmentServiceRepository;

    @Override
    public void validatePaymentEligibility(Long appointmentId) {

        log.info("Validating payment eligibility for appointmentId={}", appointmentId);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> {
                    log.error("Appointment not found for payment. appointmentId={}", appointmentId);
                    return new IllegalArgumentException("Appointment not found");
                });

        String status = appointment.getStatus();

        if (!PENDING.equals(status)) {
            log.warn(
                    "Payment attempted for non-PENDING appointment. appointmentId={}, status={}",
                    appointmentId,
                    status);
            throw new IllegalStateException("Payment not allowed for this appointment status");
        }

        paymentRepository.findByAppointmentId(appointmentId).ifPresent(payment -> {
            log.error("Duplicate payment attempt detected. appointmentId={}", appointmentId);
            throw new IllegalStateException("Payment already exists for this appointment");
        });

        log.info("Payment eligibility validated successfully for appointmentId={}", appointmentId);
    }

    @Override
    public BigDecimal calculateAppointmentAmount(Long appointmentId) {

        log.info("Calculating total amount for appointmentId={}", appointmentId);

        BigDecimal total = appointmentServiceRepository
                .findByAppointment_Id(appointmentId)
                .stream()
                .map(AppointmentService::getServicePrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            log.error("Calculated invalid payment amount={} for appointmentId={}", total, appointmentId);
            throw new IllegalStateException("Invalid payment amount");
        }

        log.info("Total amount calculated={} for appointmentId={}", total, appointmentId);
        return total;
    }

    @Override
    public String createPaymentIntent(Long appointmentId) {

        log.info("Starting PaymentIntent creation for appointmentId={}", appointmentId);

        // 1. Validate eligibility
        validatePaymentEligibility(appointmentId);

        // 2. Calculate amount
        BigDecimal amount = calculateAppointmentAmount(appointmentId);

        // 3. Convert to cents (Stripe uses smallest currency unit)
        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValueExact();

        try {
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("aud")
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods
                                    .builder()
                                    .setEnabled(true) // Apple Pay + Google Pay
                                    .build())
                    .putMetadata("appointmentId", appointmentId.toString())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            // 4. Save payment record
            Payment payment = Payment.builder()
                    .appointment(
                            appointmentRepository.getReferenceById(appointmentId))
                    .stripePaymentId(intent.getId())
                    .amount(amount)
                    .status(PaymentStatus.INITIATED)
                    .build();

            paymentRepository.save(payment);

            log.info("PaymentIntent created successfully. appointmentId={}, stripePaymentId={}",
                    appointmentId, intent.getId());

            return intent.getClientSecret();

        } catch (Exception e) {
            log.error("Failed to create PaymentIntent for appointmentId={}", appointmentId, e);
            throw new IllegalStateException("Payment initialization failed");
        }
    }

}
