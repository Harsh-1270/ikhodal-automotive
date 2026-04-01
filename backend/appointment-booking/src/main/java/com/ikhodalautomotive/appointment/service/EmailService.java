package com.ikhodalautomotive.appointment.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otp);

    void sendForgotPasswordOtp(String toEmail, String otp);

    void sendContactMessageToAdmin(String name, String fromEmail, String subject, String message);
    
    void sendBookingConfirmationWithInvoice(com.ikhodalautomotive.appointment.model.Appointment appointment, byte[] invoicePdf);
}
