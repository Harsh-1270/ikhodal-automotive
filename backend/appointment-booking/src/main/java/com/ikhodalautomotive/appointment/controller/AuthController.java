package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AuthResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.ApiResponseDTO;
import com.ikhodalautomotive.appointment.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponseDTO> signup(@RequestBody SignupRequestDTO dto) {
        authService.signup(dto);
        return ResponseEntity.ok(new ApiResponseDTO("OTP sent to email"));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponseDTO> verifyOtp(@RequestBody VerifyOtpRequestDTO dto) {
        authService.verifyOtp(dto);
        return ResponseEntity.ok(new ApiResponseDTO("Account verified"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginRequestDTO dto) {
        String token = authService.login(dto);
        return ResponseEntity.ok(new AuthResponseDTO(token, "Login successful"));
    }
}
