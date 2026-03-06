package com.ikhodalautomotive.appointment.service;

import java.util.Map;

import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;

import com.ikhodalautomotive.appointment.dto.request.ResetPasswordRequestDTO;

public interface AuthService {

    void signup(SignupRequestDTO request);

    Map<String, String> login(LoginRequestDTO request);

    void verifyOtp(VerifyOtpRequestDTO request);

    void logout(String email);

    Map<String, String> refreshAccessToken(String refreshToken);

    void requestForgotPassword(String email);

    void verifyForgotPasswordOtp(String email, String otp);

    void resetPassword(ResetPasswordRequestDTO request);

}
