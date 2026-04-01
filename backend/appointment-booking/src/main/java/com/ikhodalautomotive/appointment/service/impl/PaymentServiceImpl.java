package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.constants.AppointmentStatusConstants;
import com.ikhodalautomotive.appointment.dto.response.PaymentHistoryResponseDTO;
import com.ikhodalautomotive.appointment.enums.PaymentStatus;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.AppointmentService;
import com.ikhodalautomotive.appointment.model.Payment;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentServiceRepository;
import com.ikhodalautomotive.appointment.repository.PaymentRepository;
import com.ikhodalautomotive.appointment.service.EmailService;
import com.ikhodalautomotive.appointment.service.PaymentService;
import com.stripe.model.Customer;
import com.stripe.model.Invoice;
import com.stripe.model.InvoiceItem;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerListParams;
import com.stripe.param.InvoiceCreateParams;
import com.stripe.param.InvoiceItemCreateParams;
import com.stripe.param.InvoicePayParams;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.URL;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import static com.ikhodalautomotive.appointment.constants.AppointmentStatusConstants.PENDING;
import static com.ikhodalautomotive.appointment.constants.AppointmentStatusConstants.CONFIRMED;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;
    private final AppointmentServiceRepository appointmentServiceRepository;
    private final EmailService emailService;

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
            log.warn("Payment attempted for non-PENDING appointment. appointmentId={}, status={}",
                    appointmentId, status);
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

        validatePaymentEligibility(appointmentId);
        BigDecimal amount = calculateAppointmentAmount(appointmentId);
        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValueExact();

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        String userEmail = appointment.getUser().getEmail();
        
        try {
            Customer customer = getOrCreateStripeCustomer(userEmail, appointment.getUser().getName());

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency("aud")
                    .setCustomer(customer.getId())
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .setReceiptEmail(userEmail)
                    .setDescription("I Khodal Automotive - Booking #" + appointmentId)
                    .putMetadata("appointmentId", appointmentId.toString())
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);

            Payment payment = Payment.builder()
                    .appointment(appointmentRepository.getReferenceById(appointmentId))
                    .stripePaymentId(intent.getId())
                    .amount(amount)
                    .status(PaymentStatus.INITIATED)
                    .build();

            paymentRepository.save(payment);

            log.info("PaymentIntent created successfully. appointmentId={}, stripePaymentId={}, receiptEmail={}",
                    appointmentId, intent.getId(), userEmail);

            return intent.getClientSecret();

        } catch (Exception e) {
            log.error("EXCEPTION in createPaymentIntent for appointmentId={}: {}", appointmentId, e.getMessage());
            log.error("Stack trace: ", e);
            throw new IllegalStateException("Payment initialization failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public String verifyAndConfirmPayment(Long appointmentId) {
        log.info("Verifying payment for appointmentId={}", appointmentId);

        Payment payment = paymentRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> {
                    log.error("No payment found for appointmentId={}", appointmentId);
                    return new IllegalArgumentException("Payment not found for this appointment");
                });

        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            log.info("Payment already confirmed for appointmentId={}", appointmentId);
            return CONFIRMED;
        }

        try {
            PaymentIntent intent = PaymentIntent.retrieve(payment.getStripePaymentId());
            String stripeStatus = intent.getStatus();

            log.info("Stripe PaymentIntent status={} for appointmentId={}, stripePaymentId={}",
                    stripeStatus, appointmentId, payment.getStripePaymentId());

            if ("succeeded".equals(stripeStatus)) {
                processSuccessfulPayment(payment, intent);
                log.info("Payment verified and confirmed for appointmentId={}", appointmentId);
                return CONFIRMED;
            } else {
                log.info("Payment not yet succeeded. stripeStatus={}, appointmentId={}",
                        stripeStatus, appointmentId);
                return payment.getAppointment().getStatus();
            }

        } catch (Exception e) {
            log.error("EXCEPTION in verifyAndConfirmPayment for appointmentId={}: {}", appointmentId, e.getMessage());
            log.error("Stack trace: ", e);
            return payment.getAppointment().getStatus();
        }
    }

    @Transactional
    public void processSuccessfulPayment(Payment payment, PaymentIntent paymentIntent) {
        if (payment.getStatus() == PaymentStatus.SUCCESS) {
            log.info("Payment already marked as SUCCESS for appointmentId={}", payment.getAppointment().getId());
            return;
        }

        log.info("Processing successful payment for appointmentId={}", payment.getAppointment().getId());

        payment.setStatus(PaymentStatus.SUCCESS);
        payment.setPaymentTime(LocalDateTime.now());
        paymentRepository.save(payment);

        Appointment appointment = payment.getAppointment();
        appointment.setStatus(AppointmentStatusConstants.CONFIRMED);
        appointmentRepository.save(appointment);

        try {
            byte[] invoicePdf = null;
            String invoiceId = paymentIntent.getInvoice();

            if (invoiceId == null) {
                log.info("No automatic invoice found. Creating manual invoice for stripePaymentId={}", paymentIntent.getId());
                invoiceId = createManualInvoice(paymentIntent);
            }

            if (invoiceId != null) {
                payment.setStripeInvoiceId(invoiceId);
                paymentRepository.save(payment);

                log.info("Fetching Stripe invoice for invoiceId={}", invoiceId);
                Invoice invoice = Invoice.retrieve(invoiceId);
                String pdfUrl = invoice.getInvoicePdf();

                if (pdfUrl != null) {
                    invoicePdf = downloadFile(pdfUrl);
                }
            }

            emailService.sendBookingConfirmationWithInvoice(appointment, invoicePdf);
            log.info("Confirmation email sent for appointmentId={}", appointment.getId());

        } catch (Exception e) {
            log.error("Failed to send booking confirmation email or fetch invoice: {}", e.getMessage());
        }
    }

    private String createManualInvoice(PaymentIntent paymentIntent) throws Exception {
        String customerId = paymentIntent.getCustomer();
        if (customerId == null) {
            log.warn("Cannot create manual invoice: Customer ID is null on PaymentIntent");
            return null;
        }

        InvoiceItemCreateParams itemParams = InvoiceItemCreateParams.builder()
                .setCustomer(customerId)
                .setAmount(paymentIntent.getAmount())
                .setCurrency(paymentIntent.getCurrency())
                .setDescription(paymentIntent.getDescription())
                .build();
        InvoiceItem.create(itemParams);

        InvoiceCreateParams invoiceParams = InvoiceCreateParams.builder()
                .setCustomer(customerId)
                .setAutoAdvance(true)
                .build();
        Invoice invoice = Invoice.create(invoiceParams);

        invoice = invoice.finalizeInvoice();

        InvoicePayParams payParams = InvoicePayParams.builder()
                .setPaidOutOfBand(true)
                .build();
        invoice = invoice.pay(payParams);

        return invoice.getId();
    }

    private byte[] downloadFile(String urlString) throws Exception {
        URL url = new URL(urlString);
        try (InputStream in = url.openStream();
             ByteArrayOutputStream outStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[1024];
            int n;
            while ((n = in.read(buffer)) != -1) {
                outStream.write(buffer, 0, n);
            }
            return outStream.toByteArray();
        }
    }

    @Override
    public List<PaymentHistoryResponseDTO> getPaymentHistory(String email) {
        log.info("Fetching payment history for email={}", email);
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");

        return paymentRepository.findByAppointmentUserEmailOrderByPaymentTimeDesc(email).stream()
                .map(payment -> {
                    List<AppointmentService> appointmentServices = appointmentServiceRepository
                            .findByAppointment_Id(payment.getAppointment().getId());

                    String serviceNames = appointmentServices.stream()
                            .map(as -> as.getService().getName())
                            .collect(Collectors.joining(", "));

                    String serviceIcon = appointmentServices.isEmpty() ? "🛠️"
                            : appointmentServices.get(0).getService().getIcon();

                    return PaymentHistoryResponseDTO.builder()
                            .id(payment.getId())
                            .bookingId(payment.getAppointment().getId())
                            .amount(payment.getAmount())
                            .date(payment.getPaymentTime())
                            .status(payment.getStatus().name())
                            .serviceName(serviceNames)
                            .serviceIcon(serviceIcon)
                            .invoiceNumber(payment.getStripeInvoiceId() != null ? payment.getStripeInvoiceId() : "INV-" + payment.getId() + "-" + payment.getAppointment().getId())
                            .paymentMethod("Card")
                            .time(payment.getPaymentTime() != null ? payment.getPaymentTime().format(timeFormatter)
                                    : "N/A")
                            .build();
                })
                .collect(Collectors.toList());
    }

    private Customer getOrCreateStripeCustomer(String email, String name) throws Exception {
        CustomerListParams listParams = CustomerListParams.builder()
                .setEmail(email)
                .setLimit(1L)
                .build();

        List<Customer> customers = Customer.list(listParams).getData();
        if (!customers.isEmpty()) {
            return customers.get(0);
        }

        CustomerCreateParams createParams = CustomerCreateParams.builder()
                .setEmail(email)
                .setName(name)
                .build();

        return Customer.create(createParams);
    }
}
