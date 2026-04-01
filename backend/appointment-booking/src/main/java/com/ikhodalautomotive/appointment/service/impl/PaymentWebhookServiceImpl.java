package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.model.Payment;
import com.ikhodalautomotive.appointment.repository.PaymentRepository;
import com.ikhodalautomotive.appointment.service.PaymentWebhookService;
import com.ikhodalautomotive.appointment.enums.PaymentStatus;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentWebhookServiceImpl implements PaymentWebhookService {

    private final PaymentRepository paymentRepository;
    private final PaymentServiceImpl paymentService;

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
                log.info("Payment succeeded via webhook for stripePaymentId={}", stripePaymentId);
                paymentService.processSuccessfulPayment(payment, paymentIntent);
            }

            case "payment_intent.payment_failed" -> {
                log.warn("Payment failed via webhook for stripePaymentId={}", stripePaymentId);
                payment.setStatus(PaymentStatus.FAILED);
                paymentRepository.save(payment);
            }

            default -> log.info("Unhandled event type={}", event.getType());
        }
    }
}
