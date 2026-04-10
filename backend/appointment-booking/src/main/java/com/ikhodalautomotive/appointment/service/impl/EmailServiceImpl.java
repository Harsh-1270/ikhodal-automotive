package com.ikhodalautomotive.appointment.service.impl;

import java.util.Base64;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.repository.AppointmentServiceRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.EmailService;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.Attachment;
import com.resend.services.emails.model.CreateEmailOptions;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final Resend resendClient;

    @Value("${resend.from-email}")
    private String fromEmailRaw;

    @Value("${resend.admin-email}")
    private String fallbackAdminEmail;

    private final AppointmentServiceRepository appointmentServiceRepository;
    private final UserRepository userRepository;

    public EmailServiceImpl(@Value("${resend.api-key}") String apiKey,
            AppointmentServiceRepository appointmentServiceRepository,
            UserRepository userRepository) {
        this.resendClient = new Resend(apiKey);
        this.appointmentServiceRepository = appointmentServiceRepository;
        this.userRepository = userRepository;
    }

    /**
     * Returns the formatted "from" address with display name. Resend requires
     * the format: "Display Name <email@domain.com>"
     */
    private String getFromEmail() {
        return "I Khodal Automotive <" + fromEmailRaw + ">";
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {

        String htmlContent = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; color: #18181b; }"
                + ".wrapper { width: 100%; background-color: #f4f4f5; padding: 20px 0; }"
                + ".container { max-width: 500px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }"
                + ".header { background-color: #111827; padding: 20px; color: #ffffff; text-align: center; }"
                + ".brand { font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #ffffff; }"
                + ".content { padding: 32px 24px; text-align: center; }"
                + ".greeting { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #111827; }"
                + ".summary { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }"
                + ".otp-container { background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px dashed #cbd5e1; }"
                + ".otp-code { font-size: 36px; font-weight: 800; color: #2563eb; letter-spacing: 8px; }"
                + ".footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6; }"
                + ".footer p { margin: 4px 0; font-size: 12px; color: #6b7280; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='wrapper'>"
                + "<div class='container'>"
                + "<div class='header'>"
                + "<div class='brand'>I KHODAL<div style='font-size: 12px; font-weight: 400; letter-spacing: 4px; opacity: 0.8; margin-top: 4px;'>AUTOMOTIVE</div></div>"
                + "</div>"
                + "<div class='content'>"
                + "<p class='greeting'>Verify Your Email</p>"
                + "<p class='summary'>Thank you for registering with <strong>I Khodal Automotive</strong>. Use the code below to complete your registration.</p>"
                + "<div class='otp-container'>"
                + "<div class='otp-code'>" + otp + "</div>"
                + "</div>"
                + "<p class='summary'>This OTP is valid for <strong>10 minutes</strong>. Please do not share this code with anyone.</p>"
                + "</div>"
                + "<div class='footer'>"
                + "<p>&copy; 2026 I Khodal Automotive. All rights reserved.</p>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        sendEmail(toEmail, "\uD83D\uDD10 Verify Your Email - OTP", htmlContent, null);
    }

    @Override
    public void sendForgotPasswordOtp(String toEmail, String otp) {
        String htmlContent = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; color: #18181b; }"
                + ".wrapper { width: 100%; background-color: #f4f4f5; padding: 20px 0; }"
                + ".container { max-width: 500px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }"
                + ".header { background-color: #111827; padding: 20px; color: #ffffff; text-align: center; }"
                + ".brand { font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #ffffff; }"
                + ".content { padding: 32px 24px; text-align: center; }"
                + ".greeting { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #111827; }"
                + ".summary { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }"
                + ".otp-container { background-color: #fef2f2; border-radius: 12px; padding: 24px; margin: 24px 0; border: 2px dashed #fecaca; }"
                + ".otp-code { font-size: 36px; font-weight: 800; color: #dc2626; letter-spacing: 8px; }"
                + ".footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6; }"
                + ".footer p { margin: 4px 0; font-size: 12px; color: #6b7280; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='wrapper'>"
                + "<div class='container'>"
                + "<div class='header'>"
                + "<div class='brand'>I KHODAL<div style='font-size: 12px; font-weight: 400; letter-spacing: 4px; opacity: 0.8; margin-top: 4px;'>AUTOMOTIVE</div></div>"
                + "</div>"
                + "<div class='content'>"
                + "<p class='greeting'>Password Reset Request</p>"
                + "<p class='summary'>We received a request to reset your password for your <strong>I Khodal Automotive</strong> account. Use the code below to proceed.</p>"
                + "<div class='otp-container'>"
                + "<div class='otp-code'>" + otp + "</div>"
                + "</div>"
                + "<p class='summary'>This OTP is valid for <strong>10 minutes</strong>. If you did not request this, you can safely ignore this email.</p>"
                + "</div>"
                + "<div class='footer'>"
                + "<p>&copy; 2026 I Khodal Automotive. All rights reserved.</p>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        sendEmail(toEmail, "\uD83D\uDD10 Password Reset - OTP", htmlContent, null);
    }

    @Override
    public void sendContactMessageToAdmin(String name, String fromEmailAddr, String subject, String messageText) {
        String htmlContent = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; color: #18181b; }"
                + ".wrapper { width: 100%; background-color: #f4f4f5; padding: 20px 0; }"
                + ".container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }"
                + ".header { background-color: #111827; padding: 20px; color: #ffffff; }"
                + ".brand { font-size: 20px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #ffffff; }"
                + ".content { padding: 32px 24px; }"
                + ".greeting { font-size: 18px; font-weight: 600; margin-bottom: 24px; color: #111827; border-bottom: 2px solid #3b82f6; padding-bottom: 12px; }"
                + ".info-card { background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0; }"
                + ".info-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; display: block; }"
                + ".info-value { font-size: 15px; color: #0f172a; font-weight: 600; margin-bottom: 16px; }"
                + ".message-box { background-color: #ffffff; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; color: #334155; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }"
                + ".footer { background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #f3f4f6; }"
                + ".footer p { margin: 4px 0; font-size: 12px; color: #6b7280; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='wrapper'>"
                + "<div class='container'>"
                + "<div class='header'>"
                + "<div class='brand'>I KHODAL<div style='font-size: 12px; font-weight: 400; letter-spacing: 4px; opacity: 0.8; margin-top: 4px;'>AUTOMOTIVE</div></div>"
                + "</div>"
                + "<div class='content'>"
                + "<div class='greeting'>New Website Inquiry</div>"
                + "<div class='info-card'>"
                + "<span class='info-label'>From Name</span><div class='info-value'>" + name + "</div>"
                + "<span class='info-label'>Sender Email</span><div class='info-value'>" + fromEmailAddr + "</div>"
                + "<span class='info-label'>Subject</span><div class='info-value'>" + subject + "</div>"
                + "<span class='info-label'>Message Content</span>"
                + "<div class='message-box'>" + messageText + "</div>"
                + "</div>"
                + "</div>"
                + "<div class='footer'>"
                + "<p>This message was sent via the contact form on <strong>I Khodal Automotive</strong>.</p>"
                + "<p>&copy; 2026 I Khodal Automotive. All rights reserved.</p>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        List<User> admins = userRepository.findByRole_Name("ADMIN");
        if (admins.isEmpty()) {
            log.warn("No admins found in database. Sending contact message to fallback: {}", fallbackAdminEmail);
            sendEmail(fallbackAdminEmail, "\uD83D\uDCE8 New Contact Message: " + subject, htmlContent, fromEmailAddr);
        } else {
            for (User admin : admins) {
                log.info("Sending contact message notification to admin: {}", admin.getEmail());
                sendEmail(admin.getEmail(), "\uD83D\uDCE8 New Contact Message: " + subject, htmlContent, fromEmailAddr);
            }
        }
    }

    @Override
    public void sendBookingConfirmationWithInvoice(Appointment appointment, byte[] invoicePdf) {
        String serviceNames = appointmentServiceRepository.findByAppointment_Id(appointment.getId()).stream()
                .map(as -> as.getService().getName())
                .collect(Collectors.joining(", "));

        // Using string concatenation instead of String.formatted() because the CSS
        // hex color codes (e.g. #f1f5f9) contain '#' which conflicts with format flags.
        String htmlContent = "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<style>"
                + "body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; color: #18181b; }"
                + ".wrapper { width: 100%; background-color: #f4f4f5; padding: 20px 0; }"
                + ".container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }"
                + ".header { background-color: #111827; padding: 24px; color: #ffffff; }"
                + ".header-table { width: 100%; border-collapse: collapse; }"
                + ".brand { font-size: 22px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; color: #ffffff; }"
                + ".status { text-align: right; color: #ffffff; }"
                + ".status-title { font-size: 14px; font-weight: 700; display: block; margin-bottom: 2px; }"
                + ".order-id { font-size: 11px; color: #9ca3af; }"
                + ".content { padding: 32px 24px; }"
                + ".greeting { font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #111827; }"
                + ".summary { font-size: 14px; line-height: 1.6; color: #4b5563; margin-bottom: 24px; }"
                + ".card { background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #e2e8f0; }"
                + ".card-title { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }"
                + ".info-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }"
                + ".info-label { color: #64748b; font-weight: 500; }"
                + ".info-value { color: #0f172a; font-weight: 600; text-align: right; }"
                + ".services-list { font-size: 14px; background: #ffffff; border-radius: 8px; padding: 12px; border: 1px solid #f1f5f9; }"
                + ".service-item { color: #0f172a; font-weight: 600; padding: 4px 0; }"
                + ".action-area { text-align: center; margin: 32px 0 8px; }"
                + ".button { background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block; transition: background 0.2s; }"
                + ".footer { background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6; }"
                + ".footer p { margin: 4px 0; font-size: 12px; color: #6b7280; }"
                + ".badge { background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; }"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='wrapper'>"
                + "<div class='container'>"
                + "<div class='header'>"
                + "<table class='header-table' width='100%'>"
                + "<tr>"
                + "<td><div class='brand'>I KHODAL<div style='font-size: 12px; font-weight: 400; letter-spacing: 4px; opacity: 0.8; margin-top: 4px;'>AUTOMOTIVE</div></div></td>"
                + "<td class='status'><span class='status-title'>Appointment Confirmed</span><span class='order-id'>ID: #"
                + appointment.getId() + "</span></td>"
                + "</tr>"
                + "</table>"
                + "</div>"
                + "<div class='content'>"
                + "<div style='margin-bottom: 20px;'><span class='badge'>Payment Successful</span></div>"
                + "<p class='greeting'>Hi " + appointment.getFullName() + ",</p>"
                + "<p class='summary'>Your appointment at <strong>I Khodal Automotive</strong> has been successfully scheduled. We have received your payment and our technicians are ready for your visit!</p>"
                + "<div class='card'>"
                + "<div class='card-title'>Appointment Details</div>"
                + "<div class='info-row'><span class='info-label'>Date:</span><span class='info-value'>"
                + appointment.getAppointmentDate().toString() + "</span></div>"
                + "<div class='info-row'><span class='info-label'>Time Slot:</span><span class='info-value'>"
                + appointment.getStartTime().toString() + " - " + appointment.getEndTime().toString() + "</span></div>"
                + "<div class='info-row'><span class='info-label'>Vehicle:</span><span class='info-value'>"
                + appointment.getVehicleYear() + " " + appointment.getVehicleMake() + " "
                + appointment.getVehicleModel() + "</span></div>"
                + "<div class='info-row'><span class='info-label'>Registration:</span><span class='info-value'>"
                + appointment.getRegistrationNumber() + "</span></div>"
                + "</div>"
                + "<div class='card'>"
                + "<div class='card-title'>Selected Services</div>"
                + "<div class='services-list'>"
                + "<div class='service-item'>" + serviceNames + "</div>"
                + "</div>"
                + "</div>"
                + "<p class='summary' style='text-align: center; margin-bottom: 0;'>Your official Stripe invoice is attached as a PDF to this email.</p>"
                + "<div class='action-area'>"
                + "<a href='https://ikhodalautomotive.com/login' class='button'>Go to Account Dashboard</a>"
                + "</div>"
                + "</div>"
                + "<div class='footer'>"
                + "<p><strong>I Khodal Automotive Service Center</strong></p>"
                + "<p>Quality Service You Can Trust</p>"
                + "<p>&copy; 2026 I Khodal Automotive. All rights reserved.</p>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";

        // Send to User
        log.info("Sending booking confirmation email to user: {}", appointment.getUser().getEmail());
        sendEmailWithAttachment(appointment.getUser().getEmail(),
                "Booking Confirmation & Invoice - " + appointment.getId(), htmlContent, invoicePdf,
                "Invoice-" + appointment.getId() + ".pdf");

        // Send to Admin
        List<User> admins = userRepository.findByRole_Name("ADMIN");
        if (admins.isEmpty()) {
            log.warn("No admins found in database for booking notification. Sending to fallback: {}",
                    fallbackAdminEmail);
            sendEmailWithAttachment(fallbackAdminEmail, "New Booking & Payment Received: #" + appointment.getId(),
                    htmlContent, invoicePdf, "Invoice-" + appointment.getId() + ".pdf");
        } else {
            for (User admin : admins) {
                log.info("Sending booking notification email to admin: {}", admin.getEmail());
                sendEmailWithAttachment(admin.getEmail(), "New Booking & Payment Received: #" + appointment.getId(),
                        htmlContent, invoicePdf, "Invoice-" + appointment.getId() + ".pdf");
            }
        }
    }

    private void sendEmailWithAttachment(String toEmail, String subject, String htmlContent, byte[] attachmentBytes,
            String fileName) {
        try {
            log.info("Sending email with attachment to: {}, subject: {}", toEmail, subject);
            CreateEmailOptions.Builder optionsBuilder = CreateEmailOptions.builder()
                    .from(getFromEmail())
                    .to(toEmail)
                    .subject(subject)
                    .html(htmlContent);

            if (attachmentBytes != null && attachmentBytes.length > 0) {
                Attachment attachment = Attachment.builder()
                        .fileName(fileName)
                        .content(Base64.getEncoder().encodeToString(attachmentBytes))
                        .build();
                optionsBuilder.attachments(Collections.singletonList(attachment));
            } else {
                log.warn("No attachment content provided for email to {}. Sending without attachment.", toEmail);
            }

            resendClient.emails().send(optionsBuilder.build());
            log.info("Email sent successfully to: {}", toEmail);

        } catch (ResendException e) {
            log.error("Failed to send email with attachment to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send email with attachment to " + toEmail, e);
        }
    }

    /**
     * Shared helper to send an email via Resend API.
     */
    private void sendEmail(String toEmail, String subject, String htmlContent, String replyTo) {
        try {
            log.info("Sending email to: {}, subject: {}, replyTo: {}", toEmail, subject, replyTo);
            CreateEmailOptions params;

            if (replyTo != null && !replyTo.isEmpty()) {
                params = CreateEmailOptions.builder()
                        .from(getFromEmail())
                        .to(toEmail)
                        .subject(subject)
                        .html(htmlContent)
                        .replyTo(replyTo)
                        .build();
            } else {
                params = CreateEmailOptions.builder()
                        .from(getFromEmail())
                        .to(toEmail)
                        .subject(subject)
                        .html(htmlContent)
                        .build();
            }

            resendClient.emails().send(params);
            log.info("Email sent successfully to: {}", toEmail);

        } catch (ResendException e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send email to " + toEmail, e);
        }
    }
}
