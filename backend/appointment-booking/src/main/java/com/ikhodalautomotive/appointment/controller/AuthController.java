package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AuthResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.ApiResponseDTO;
import com.ikhodalautomotive.appointment.service.AuthService;
import com.ikhodalautomotive.appointment.service.impl.AuthServiceImpl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private AuthService authService;

    public AuthController(AuthServiceImpl authService) {
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
        java.util.Map<String, String> loginResult = authService.login(dto);
        String token = loginResult.get("token");
        String name = loginResult.get("name");
        Long roleId = Long.parseLong(loginResult.get("roleId"));
        return ResponseEntity.ok(new AuthResponseDTO(token, name, roleId, "Login successful"));
    }

    // @PostMapping("/logout")
    // public ResponseEntity<?> logout() {
    // return ResponseEntity.ok("Logged out successfully");
    // }
}
