package com.ikhodalautomotive.appointment.repository;

import com.ikhodalautomotive.appointment.model.EmailOtpVerification;
import com.ikhodalautomotive.appointment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface EmailOtpRepository extends JpaRepository<EmailOtpVerification, Long> {
    Optional<EmailOtpVerification> findByUserAndOtpCodeAndIsUsedFalse(User user, String otpCode);
}
