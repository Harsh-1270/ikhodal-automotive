package com.ikhodalautomotive.appointment.service.impl;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.EmailOtpVerification;
import com.ikhodalautomotive.appointment.model.Role;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.model.UserAuthProvider;
import com.ikhodalautomotive.appointment.repository.EmailOtpRepository;
import com.ikhodalautomotive.appointment.repository.RoleRepository;
import com.ikhodalautomotive.appointment.repository.UserAuthProviderRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.security.JwtUtil;
import com.ikhodalautomotive.appointment.service.AuthService;
import com.ikhodalautomotive.appointment.service.EmailService;

import jakarta.transaction.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserAuthProviderRepository authProviderRepository;

    @Autowired
    private EmailOtpRepository otpRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    // ================= SIGNUP =================
    @Override
    @Transactional
    public void signup(SignupRequestDTO request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ApiException("Email already registered");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new ApiException("Role not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setActive(false);
        user.setRole(userRole);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        UserAuthProvider provider = new UserAuthProvider();
        provider.setUser(user);
        provider.setProvider("LOCAL");
        provider.setCreatedAt(LocalDateTime.now());
        authProviderRepository.save(provider);
                                                                                                                        
        String otp = generateOtp();

        EmailOtpVerification otpEntity = new EmailOtpVerification();
        otpEntity.setUser(user);
        otpEntity.setOtpCode(otp);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpEntity.setUsed(false);
        otpEntity.setCreatedAt(LocalDateTime.now());
        otpRepository.save(otpEntity);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    // ================= VERIFY OTP =================
    @Override
    @Transactional
    public void verifyOtp(VerifyOtpRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("User not found"));

        EmailOtpVerification otp = otpRepository
                .findByUserAndOtpCodeAndIsUsedFalse(user, request.getOtp())
                .orElseThrow(() -> new ApiException("Invalid OTP"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException("OTP expired");
        }

        otp.setUsed(true);
        otpRepository.save(otp);

        user.setEmailVerified(true);
        user.setActive(true);
        userRepository.save(user);
    }

    // ================= LOGIN =================
    @Override
    public String login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password"));

        if (!user.isEmailVerified()) {
            throw new ApiException("Email not verified");
        }

        if(!user.isEmailVerified() || !user.isActive()) {
            throw new ApiException("Account not active. Please verify your email.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password");
        }

        return jwtUtil.generateToken(user.getEmail(), "ROLE_" + user.getRole().getName());
    }

    // ================= UTIL =================
    private String generateOtp() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }
}
