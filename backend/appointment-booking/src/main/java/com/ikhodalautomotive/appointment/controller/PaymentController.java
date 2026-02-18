package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.request.CreatePaymentIntentRequest;
import com.ikhodalautomotive.appointment.dto.response.PaymentHistoryResponseDTO;
import com.ikhodalautomotive.appointment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

        private final PaymentService paymentService;

        // POST : localhost:8082/api/payments/create-intent
        @PostMapping("/create-intent")
        public Map<String, String> createPaymentIntent(
                        @RequestBody CreatePaymentIntentRequest request) {

                log.info("Received create payment intent request for appointmentId={}",
                                request.getAppointmentId());

                // Calculate amount first (will also be used inside createPaymentIntent)
                java.math.BigDecimal amount = paymentService.calculateAppointmentAmount(request.getAppointmentId());

                String clientSecret = paymentService.createPaymentIntent(request.getAppointmentId());

                return Map.of("clientSecret", clientSecret, "amount", amount.toString());
        }

        // POST : localhost:8082/api/payments/verify/{appointmentId}
        @PostMapping("/verify/{appointmentId}")
        public Map<String, String> verifyPayment(@PathVariable Long appointmentId) {
                log.info("Received verify payment request for appointmentId={}", appointmentId);
                String status = paymentService.verifyAndConfirmPayment(appointmentId);
                return Map.of("status", status);
        }

        @GetMapping("/history")
        public List<PaymentHistoryResponseDTO> getPaymentHistory(Authentication authentication) {
                String email = authentication.getName();
                log.info("Received payment history request for email={}", email);
                return paymentService.getPaymentHistory(email);
        }

}
