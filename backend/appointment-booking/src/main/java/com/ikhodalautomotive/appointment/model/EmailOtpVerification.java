package com.ikhodalautomotive.appointment.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "email_otp_verifications")
public class EmailOtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String otpCode;
    private LocalDateTime expiresAt;
    private boolean isUsed;
    private LocalDateTime createdAt;
}
