package com.ikhodalautomotive.appointment.service.impl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.ikhodalautomotive.appointment.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("🔐 Verify Your Email - OTP");

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

            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }
}
