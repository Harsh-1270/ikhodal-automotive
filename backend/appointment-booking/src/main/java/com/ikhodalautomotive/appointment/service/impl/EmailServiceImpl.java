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
     * Returns the formatted "from" address with display name.
     * Resend requires the format: "Display Name <email@domain.com>"
     */
    private String getFromEmail() {
        return "I Khodal Automotive <" + fromEmailRaw + ">";
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
        + "<html lang='en'>"
        + "<head>"
        + "<meta charset='UTF-8'>"
        + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
        + "<title>Booking Confirmed</title>"
        + "</head>"
        + "<body style='margin:0;padding:0;background-color:#f1f5f9;font-family:Segoe UI,Tahoma,Geneva,Verdana,sans-serif;'>"

        // ── Outer wrapper
        + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:#f1f5f9;padding:32px 16px;'>"
        + "<tr><td align='center'>"

        // ── Card
        + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>"

        // ── HEADER BANNER
        + "<tr>"
        + "<td style='background:linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%);padding:40px 40px 32px;text-align:center;'>"
        + "<div style='display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;margin-bottom:16px;'>&#10003;</div>"
        + "<h1 style='margin:0 0 8px;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;'>Booking Confirmed!</h1>"
        + "<p style='margin:0;color:rgba(255,255,255,0.85);font-size:15px;'>Thank you for choosing I Khodal Automotive</p>"
        + "</td>"
        + "</tr>"

        // ── STATUS PILL + GREETING
        + "<tr>"
        + "<td style='padding:32px 40px 0;'>"
        + "<div style='display:inline-block;background-color:#dcfce7;color:#166534;font-size:13px;font-weight:700;padding:6px 16px;border-radius:9999px;letter-spacing:0.3px;margin-bottom:20px;'>&#10003;&nbsp; Payment Successful</div>"
        + "<p style='margin:0 0 8px;color:#0f172a;font-size:17px;font-weight:600;'>Hi " + appointment.getFullName() + ",</p>"
        + "<p style='margin:0 0 24px;color:#64748b;font-size:14px;line-height:1.7;'>Your appointment is confirmed and payment has been processed. Your invoice is attached to this email for your records.</p>"
        + "</td>"
        + "</tr>"

        // ── BOOKING DETAILS CARD
        + "<tr>"
        + "<td style='padding:0 40px;'>"
        + "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;'>"

        // card heading
        + "<tr><td colspan='2' style='background-color:#1e3a8a;padding:14px 20px;'>"
        + "<span style='color:#ffffff;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;'>&#128197;&nbsp; Appointment Details</span>"
        + "</td></tr>"

        // Booking ID
        + "<tr style='border-bottom:1px solid #e2e8f0;'>"
        + "<td style='padding:14px 20px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:40%;'>Booking ID</td>"
        + "<td style='padding:14px 20px;color:#0f172a;font-size:14px;font-weight:700;'>#" + appointment.getId() + "</td>"
        + "</tr>"

        // Date
        + "<tr style='border-bottom:1px solid #e2e8f0;background-color:#ffffff;'>"
        + "<td style='padding:14px 20px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;'>Date</td>"
        + "<td style='padding:14px 20px;color:#0f172a;font-size:14px;font-weight:600;'>" + appointment.getAppointmentDate().toString() + "</td>"
        + "</tr>"

        // Time
        + "<tr style='border-bottom:1px solid #e2e8f0;'>"
        + "<td style='padding:14px 20px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;'>Time</td>"
        + "<td style='padding:14px 20px;color:#0f172a;font-size:14px;font-weight:600;'>" + appointment.getStartTime().toString() + " &ndash; " + appointment.getEndTime().toString() + "</td>"
        + "</tr>"

        // Services
        + "<tr style='border-bottom:1px solid #e2e8f0;background-color:#ffffff;'>"
        + "<td style='padding:14px 20px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;'>Services</td>"
        + "<td style='padding:14px 20px;color:#1e3a8a;font-size:14px;font-weight:700;'>" + serviceNames + "</td>"
        + "</tr>"

        // divider row label
        + "<tr><td colspan='2' style='padding:12px 20px 4px;background-color:#eff6ff;'>"
        + "<span style='color:#3b82f6;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;'>&#128663;&nbsp; Vehicle Information</span>"
        + "</td></tr>"

        // Vehicle
        + "<tr style='border-bottom:1px solid #e2e8f0;background-color:#ffffff;'>"
        + "<td style='padding:14px 20px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;'>Vehicle</td>"
        + "<td style='padding:14px 20px;color:#0f172a;font-size:14px;font-weight:600;'>" + appointment.getVehicleYear() + " " + appointment.getVehicleMake() + " " + appointment.getVehicleModel() + "</td>"
        + "</tr>"

        // Registration
        + "<tr>"
        + "<td style='padding:14px 20px;color:#64748b;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;'>Registration</td>"
        + "<td style='padding:14px 20px;'><span style='background-color:#1e3a8a;color:#ffffff;font-size:13px;font-weight:700;padding:4px 12px;border-radius:6px;letter-spacing:1px;'>" + appointment.getRegistrationNumber() + "</span></td>"
        + "</tr>"

        + "</table>"
        + "</td>"
        + "</tr>"

        // ── CTA BUTTON
        + "<tr>"
        + "<td style='padding:28px 40px 0;text-align:center;'>"
        + "<a href='https://ikhodalautomotive.com/login' style='display:inline-block;background:linear-gradient(135deg,#1e3a8a,#3b82f6);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:8px;letter-spacing:0.3px;'>View My Bookings &rarr;</a>"
        + "</td>"
        + "</tr>"

        // ── HELP NOTE
        + "<tr>"
        + "<td style='padding:20px 40px 32px;text-align:center;'>"
        + "<p style='margin:0;color:#94a3b8;font-size:13px;line-height:1.6;'>Questions? Reply to this email or visit our website.<br>We look forward to serving you!</p>"
        + "</td>"
        + "</tr>"

        // ── FOOTER
        + "<tr>"
        + "<td style='background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;'>"
        + "<p style='margin:0 0 4px;color:#1e3a8a;font-size:14px;font-weight:700;'>I Khodal Automotive</p>"
        + "<p style='margin:0 0 12px;color:#94a3b8;font-size:13px;'>Quality Service You Can Trust</p>"
        + "<p style='margin:0;color:#cbd5e1;font-size:12px;'>&copy; 2026 I Khodal Automotive. All rights reserved.</p>"
        + "</td>"
        + "</tr>"

        + "</table>"
        + "</td></tr>"
        + "</table>"
        + "</body>"
        + "</html>";

        // Send to User
        log.info("Sending booking confirmation email to user: {}", appointment.getUser().getEmail());
        sendEmailWithAttachment(appointment.getUser().getEmail(), "Booking Confirmation & Invoice - " + appointment.getId(), htmlContent, invoicePdf, "Invoice-" + appointment.getId() + ".pdf");
        
        // Send to Admin
        List<User> admins = userRepository.findByRole_Name("ADMIN");
        if (admins.isEmpty()) {
            log.warn("No admins found in database for booking notification. Sending to fallback: {}", fallbackAdminEmail);
            sendEmailWithAttachment(fallbackAdminEmail, "New Booking & Payment Received: #" + appointment.getId(), htmlContent, invoicePdf, "Invoice-" + appointment.getId() + ".pdf");
        } else {
            for (User admin : admins) {
                log.info("Sending booking notification email to admin: {}", admin.getEmail());
                sendEmailWithAttachment(admin.getEmail(), "New Booking & Payment Received: #" + appointment.getId(), htmlContent, invoicePdf, "Invoice-" + appointment.getId() + ".pdf");
            }
        }
    }

    private void sendEmailWithAttachment(String toEmail, String subject, String htmlContent, byte[] attachmentBytes, String fileName) {
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
