package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AuthResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.ApiResponseDTO;
import com.ikhodalautomotive.appointment.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // POST : localhost:8082/api/auth/signup
    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDTO> signup(@RequestBody SignupRequestDTO dto) {
        authService.signup(dto);
        return ResponseEntity.ok(new ApiResponseDTO("OTP sent to email"));
    }

    // POST : localhost:8082/api/auth/verify-otp
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponseDTO> verifyOtp(@RequestBody VerifyOtpRequestDTO dto) {
        authService.verifyOtp(dto);
        return ResponseEntity.ok(new ApiResponseDTO("Account verified"));
    }

    // POST : localhost:8082/api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        Map<String, String> loginResult = authService.login(dto);
        String token = loginResult.get("token");
        String refreshToken = loginResult.get("refreshToken");
        String name = loginResult.get("name");
        Long roleId = Long.parseLong(loginResult.get("roleId"));
        return ResponseEntity.ok(new AuthResponseDTO(token, refreshToken, name, roleId, "Login successful"));
    }

    // POST : localhost:8082/api/auth/refresh
    // Exchange a valid refresh token for a new access token (no auth header needed)
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null || refreshToken.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Refresh token is required"));
        }
        Map<String, String> result = authService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(result);
    }

    // POST : localhost:8082/api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponseDTO> logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        authService.logout(email);
        return ResponseEntity.ok(new ApiResponseDTO("Logged out successfully"));
    }
}
