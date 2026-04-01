package com.ikhodalautomotive.appointment.service.impl;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.Attachment;
import com.resend.services.emails.model.CreateEmailOptions;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Collections;
import java.util.stream.Collectors;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.repository.AppointmentServiceRepository;
import com.ikhodalautomotive.appointment.service.EmailService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    private final Resend resendClient;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Value("${resend.from-email}")
    private String adminEmail;

    private final AppointmentServiceRepository appointmentServiceRepository;

    public EmailServiceImpl(@Value("${resend.api-key}") String apiKey, AppointmentServiceRepository appointmentServiceRepository) {
        this.resendClient = new Resend(apiKey);
        this.appointmentServiceRepository = appointmentServiceRepository;
    }

    @Override
    public void sendOtpEmail(String toEmail, String otp) {

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            padding: 20px;
                        }
                        .container {
                            max-width: 500px;
                            background: #ffffff;
                            margin: auto;
                            padding: 25px;
                            border-radius: 8px;
                            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            color: #1f2937;
                        }
                        .otp {
                            font-size: 32px;
                            font-weight: bold;
                            color: #2563eb;
                            text-align: center;
                            margin: 20px 0;
                            letter-spacing: 4px;
                        }
                        .text {
                            color: #4b5563;
                            font-size: 14px;
                            line-height: 1.6;
                        }
                        .footer {
                            margin-top: 30px;
                            font-size: 12px;
                            color: #9ca3af;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="header">Email Verification</h2>
                        <p class="text">
                            Thank you for registering with <b>I khodal Automotive</b>.
                            Please use the OTP below to verify your email address.
                        </p>

                        <div class="otp">""" + otp + """
                            </div>

                            <p class="text">
                                This OTP is valid for <b>10 minutes</b>.
                                Do not share this code with anyone.
                            </p>

                            <p class="text">
                                If you did not request this, please ignore this email.
                            </p>

                            <div class="footer">
                                © 2026 I khodal Automotive. All rights reserved.
                            </div>
                        </div>
                    </body>
                    </html>
                """;

        sendEmail(toEmail, "\uD83D\uDD10 Verify Your Email - OTP", htmlContent, null);
    }

    @Override
    public void sendForgotPasswordOtp(String toEmail, String otp) {
        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            padding: 20px;
                        }
                        .container {
                            max-width: 500px;
                            background: #ffffff;
                            margin: auto;
                            padding: 25px;
                            border-radius: 8px;
                            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            color: #1f2937;
                        }
                        .otp {
                            font-size: 32px;
                            font-weight: bold;
                            color: #dc2626;
                            text-align: center;
                            margin: 20px 0;
                            letter-spacing: 4px;
                        }
                        .text {
                            color: #4b5563;
                            font-size: 14px;
                            line-height: 1.6;
                        }
                        .footer {
                            margin-top: 30px;
                            font-size: 12px;
                            color: #9ca3af;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="header">Password Reset Request</h2>
                        <p class="text">
                            We received a request to reset your password for your <b>I khodal Automotive</b> account.
                            Please use the OTP below to proceed with the password reset.
                        </p>

                        <div class="otp">"""
                + otp + """
                                    </div>

                                    <p class="text">
                                        This OTP is valid for <b>10 minutes</b>.
                                        If you did not request a password reset, you can safely ignore this email.
                                    </p>

                                    <div class="footer">
                                        © 2026 I khodal Automotive. All rights reserved.
                                    </div>
                                </div>
                            </body>
                            </html>
                        """;

        sendEmail(toEmail, "\uD83D\uDD10 Password Reset - OTP", htmlContent, null);
    }

    @Override
    public void sendContactMessageToAdmin(String name, String fromEmailAddr, String subject, String messageText) {
        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f8fafc;
                            padding: 20px;
                            margin: 0;
                        }
                        .container {
                            max-width: 600px;
                            background: #ffffff;
                            margin: 20px auto;
                            padding: 40px;
                            border-radius: 16px;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                            border: 1px solid #e2e8f0;
                        }
                        .header {
                            border-bottom: 2px solid #3b82f6;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .header h2 {
                            color: #1e3a8a;
                            margin: 0;
                            font-size: 24px;
                        }
                        .info-row {
                            margin-bottom: 20px;
                            padding: 15px;
                            background-color: #f1f5f9;
                            border-radius: 8px;
                        }
                        .label {
                            font-weight: 700;
                            color: #64748b;
                            font-size: 12px;
                            text-transform: uppercase;
                            margin-bottom: 5px;
                            display: block;
                        }
                        .value {
                            color: #1e293b;
                            font-size: 16px;
                        }
                        .message-box {
                            padding: 20px;
                            background-color: #ffffff;
                            border: 1px solid #e2e8f0;
                            border-radius: 12px;
                            color: #334155;
                            line-height: 1.8;
                            font-size: 15px;
                            white-space: pre-wrap;
                        }
                        .footer {
                            margin-top: 40px;
                            font-size: 13px;
                            color: #94a3b8;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>New Website Inquiry</h2>
                        </div>

                        <div class="info-row">
                            <span class="label">From Name</span>
                            <div class="value">""" + name + """
                    </div>
                </div>

                <div class="info-row">
                    <span class="label">Sender Email</span>
                    <div class="value">""" + fromEmailAddr + """
                    </div>
                </div>

                <div class="info-row">
                    <span class="label">Subject</span>
                    <div class="value">""" + subject + """
                    </div>
                </div>

                <div class="label">Message Content</div>
                <div class="message-box">""" + messageText + """
                        </div>

                        <div class="footer">
                            This message was sent via the contact form on <b>I Khodal Automotive</b> website.
                            <br><br>
                            © 2026 I Khodal Automotive
                        </div>
                    </div>
                </body>
                </html>
                """;

        sendEmail(adminEmail, "\uD83D\uDCE8 New Contact Message: " + subject, htmlContent, fromEmailAddr);
    }

    @Override
    public void sendBookingConfirmationWithInvoice(Appointment appointment, byte[] invoicePdf) {
        String serviceNames = appointmentServiceRepository.findByAppointment_Id(appointment.getId()).stream()
                .map(as -> as.getService().getName())
                .collect(Collectors.joining(", "));

        String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
                        .container { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 20px; text-align: center; color: #ffffff; }
                        .header h1 { margin: 0; font-size: 28px; letter-spacing: -0.5px; }
                        .content { padding: 40px; }
                        .status-badge { display: inline-block; padding: 6px 12px; background-color: #dcfce7; color: #166534; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
                        .booking-details { background-color: #f8fafc; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #e2e8f0; }
                        .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 15px; }
                        .detail-label { color: #64748b; font-weight: 500; }
                        .detail-value { color: #0f172a; font-weight: 600; }
                        .vehicle-info { border-top: 1px solid #e2e8f0; margin-top: 20px; padding-top: 20px; }
                        .footer { background-color: #f8fafc; padding: 30px; text-align: center; font-size: 13px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
                        .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Booking Confirmed!</h1>
                            <p>Thank you for choosing I Khodal Automotive</p>
                        </div>
                        <div class="content">
                            <div class="status-badge">Payment Successful</div>
                            <p>Hi <strong>%s</strong>,</p>
                            <p>Your appointment has been successfully scheduled and your payment has been processed. We've attached your official Stripe invoice to this email for your records.</p>
                            
                            <div class="booking-details">
                                <div class="detail-row">
                                    <span class="detail-label">Booking ID</span>
                                    <span class="detail-value">#%d</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Date</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Time</span>
                                    <span class="detail-value">%s - %s</span>
                                </div>
                                <div class="detail-row">
                                    <span class="detail-label">Services</span>
                                    <span class="detail-value">%s</span>
                                </div>
                                
                                <div class="vehicle-info">
                                    <div class="detail-row">
                                        <span class="detail-label">Vehicle</span>
                                        <span class="detail-value">%s %s %s</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Registration</span>
                                        <span class="detail-value">%s</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p>You can manage your booking details through your account dashboard.</p>
                            <a href="https://ikhodalautomotive.com.au/login" class="button">Go to Dashboard</a>
                        </div>
                        <div class="footer">
                            <p><strong>I Khodal Automotive</strong><br>Quality Service You Can Trust</p>
                            <p>&copy; 2026 I Khodal Automotive. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(
                appointment.getFullName(),
                appointment.getId(),
                appointment.getAppointmentDate().toString(),
                appointment.getStartTime().toString(),
                appointment.getEndTime().toString(),
                serviceNames,
                appointment.getVehicleYear(), appointment.getVehicleMake(), appointment.getVehicleModel(),
                appointment.getRegistrationNumber()
        );

        // Send to User
        sendEmailWithAttachment(appointment.getUser().getEmail(), "Booking Confirmation & Invoice - " + appointment.getId(), htmlContent, invoicePdf, "Invoice-" + appointment.getId() + ".pdf");
        
        // Send to Admin
        sendEmailWithAttachment(adminEmail, "New Booking & Payment Received: #" + appointment.getId(), htmlContent, invoicePdf, "Invoice-" + appointment.getId() + ".pdf");
    }

    private void sendEmailWithAttachment(String toEmail, String subject, String htmlContent, byte[] attachmentBytes, String fileName) {
        try {
            CreateEmailOptions.Builder optionsBuilder = CreateEmailOptions.builder()
                    .from(fromEmail)
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

        } catch (ResendException e) {
            throw new RuntimeException("Failed to send email with attachment to " + toEmail, e);
        }
    }

    /**
     * Shared helper to send an email via Resend API.
     */
    private void sendEmail(String toEmail, String subject, String htmlContent, String replyTo) {
        try {
            CreateEmailOptions params;

            if (replyTo != null && !replyTo.isEmpty()) {
                params = CreateEmailOptions.builder()
                        .from(fromEmail)
                        .to(toEmail)
                        .subject(subject)
                        .html(htmlContent)
                        .replyTo(replyTo)
                        .build();
            } else {
                params = CreateEmailOptions.builder()
                        .from(fromEmail)
                        .to(toEmail)
                        .subject(subject)
                        .html(htmlContent)
                        .build();
            }

            resendClient.emails().send(params);

        } catch (ResendException e) {
            throw new RuntimeException("Failed to send email to " + toEmail, e);
        }
    }
}
