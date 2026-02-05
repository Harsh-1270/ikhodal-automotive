package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.Payment;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.PaymentRepository;
import com.ikhodalautomotive.appointment.service.PaymentWebhookService;
import com.ikhodalautomotive.appointment.constants.AppointmentStatusConstants;
import com.ikhodalautomotive.appointment.enums.PaymentStatus;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentWebhookServiceImpl implements PaymentWebhookService {

    private final PaymentRepository paymentRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public void processEvent(Event event) {

        log.info("Processing Stripe event type={}", event.getType());

        StripeObject stripeObject = event.getDataObjectDeserializer()
                .getObject()
                .orElse(null);

        if (!(stripeObject instanceof PaymentIntent paymentIntent)) {
            log.warn("Unhandled Stripe object type");
            return;
        }

        String stripePaymentId = paymentIntent.getId();

        Optional<Payment> paymentOpt =
                paymentRepository.findByStripePaymentId(stripePaymentId);

        if (paymentOpt.isEmpty()) {
            log.error("Payment record not found for stripePaymentId={}", stripePaymentId);
            return;
        }

        Payment payment = paymentOpt.get();

        switch (event.getType()) {

            case "payment_intent.succeeded" -> {
                log.info("Payment succeeded for stripePaymentId={}", stripePaymentId);

                if (payment.getStatus() == PaymentStatus.SUCCESS) {
                    log.warn("Duplicate success webhook ignored for stripePaymentId={}", stripePaymentId);
                    return;
                }

                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setPaymentTime(LocalDateTime.now());

                Appointment appointment = payment.getAppointment();
                appointment.setStatus(AppointmentStatusConstants.CONFIRMED);

                paymentRepository.save(payment);
                appointmentRepository.save(appointment);

                log.info("Appointment confirmed. appointmentId={}", appointment.getId());
            }

            case "payment_intent.payment_failed" -> {
                log.warn("Payment failed for stripePaymentId={}", stripePaymentId);
                payment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
            }

            default -> log.info("Unhandled event type={}", event.getType());
        }
    }
}
