package com.ikhodalautomotive.appointment.service.impl;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.ResetPasswordRequestDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.EmailOtpVerification;
import com.ikhodalautomotive.appointment.model.RefreshToken;
import com.ikhodalautomotive.appointment.model.Role;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.model.UserAuthProvider;
import com.ikhodalautomotive.appointment.repository.EmailOtpRepository;
import com.ikhodalautomotive.appointment.repository.RefreshTokenRepository;
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

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh.expiration}")
    private long refreshExpirationMs;

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
    @Transactional
    public Map<String, String> login(LoginRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Invalid email or password"));

        if (!user.isEmailVerified()) {
            throw new ApiException("Email not verified");
        }

        if (!user.isEmailVerified() || !user.isActive()) {
            throw new ApiException("Account not active. Please verify your email.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password");
        }

        // Set user as online
        user.setOnline(true);
        userRepository.save(user);

        // Generate JWT access token (1 hour)
        String accessToken = jwtUtil.generateToken(user.getEmail(), "ROLE_" + user.getRole().getName());

        // Generate refresh token (7 days) — replace existing or update
        RefreshToken refreshToken = refreshTokenRepository.findByUser(user)
                .orElse(new RefreshToken());

        refreshToken.setUser(user);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000));
        refreshToken.setCreatedAt(LocalDateTime.now());

        refreshTokenRepository.save(refreshToken);

        return Map.of(
                "token", accessToken,
                "refreshToken", refreshToken.getToken(),
                "name", user.getName(),
                "roleId", String.valueOf(user.getRole().getId()));
    }

    // ================= REFRESH TOKEN =================
    @Override
    @Transactional
    public Map<String, String> refreshAccessToken(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new ApiException("Invalid refresh token"));

        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new ApiException("Refresh token expired. Please log in again.");
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtUtil.generateToken(user.getEmail(), "ROLE_" + user.getRole().getName());

        return Map.of("token", newAccessToken);
    }

    // ================= LOGOUT =================
    @Override
    @Transactional
    public void logout(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));
        user.setOnline(false);
        userRepository.save(user);

        // Invalidate refresh token on logout
        refreshTokenRepository.deleteByUser(user);
    }

    // ================= FORGOT PASSWORD =================

    @Override
    @Transactional
    public void requestForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found with this email"));

        String otp = generateOtp();

        // Save OTP for forgot password
        EmailOtpVerification otpEntity = new EmailOtpVerification();
        otpEntity.setUser(user);
        otpEntity.setOtpCode(otp);
        otpEntity.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpEntity.setUsed(false);
        otpEntity.setCreatedAt(LocalDateTime.now());
        otpRepository.save(otpEntity);

        emailService.sendForgotPasswordOtp(email, otp);
    }

    @Override
    public void verifyForgotPasswordOtp(String email, String otpCode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found"));

        otpRepository.findByUserAndOtpCodeAndIsUsedFalse(user, otpCode)
                .filter(otp -> otp.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElseThrow(() -> new ApiException("Invalid or expired OTP"));
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequestDTO request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("User not found"));

        EmailOtpVerification otp = otpRepository
                .findByUserAndOtpCodeAndIsUsedFalse(user, request.getOtp())
                .orElseThrow(() -> new ApiException("Invalid or expired OTP"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ApiException("OTP expired");
        }

        otp.setUsed(true);
        otpRepository.save(otp);

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // ================= UTIL =================
    private String generateOtp() {
        return String.valueOf((int) (Math.random() * 900000) + 100000);
    }
}
