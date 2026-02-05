package com.ikhodalautomotive.appointment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;
import com.ikhodalautomotive.appointment.service.AuthService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    // ================= SIGNUP =================

    @Test
    void shouldSignupUserAndSendOtp() throws Exception {

        SignupRequestDTO dto = new SignupRequestDTO();
        dto.setName("Test User");
        dto.setEmail("test@test.com");
        dto.setPassword("password");

        doNothing().when(authService).signup(dto);

        mockMvc.perform(
                post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message")
                .value("OTP sent to email"));
    }

    // ================= VERIFY OTP =================

    @Test
    void shouldVerifyOtpSuccessfully() throws Exception {

        VerifyOtpRequestDTO dto = new VerifyOtpRequestDTO();
        dto.setEmail("test@test.com");
        dto.setOtp("123456");

        doNothing().when(authService).verifyOtp(dto);

        mockMvc.perform(
                post("/api/auth/verify-otp")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message")
                .value("Account verified"));
    }

    // ================= LOGIN =================

    @Test
    void shouldLoginSuccessfully() throws Exception {

        LoginRequestDTO dto = new LoginRequestDTO();
        dto.setEmail("test@test.com");
        dto.setPassword("password");

        when(authService.login(dto))
                .thenReturn("JWT_TOKEN");

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto))
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").value("JWT_TOKEN"))
        .andExpect(jsonPath("$.message")
                .value("Login successful"));
    }
}
