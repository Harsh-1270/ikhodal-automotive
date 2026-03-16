package com.ikhodalautomotive.appointment.service.impl;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ikhodalautomotive.appointment.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    private final Resend resendClient;

    @Value("${resend.from-email}")
    private String fromEmail;

    @Value("${resend.from-email}")
    private String adminEmail;

    public EmailServiceImpl(@Value("${resend.api-key}") String apiKey) {
        this.resendClient = new Resend(apiKey);
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
