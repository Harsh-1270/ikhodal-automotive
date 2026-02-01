package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.LoginRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.SignupRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.VerifyOtpRequestDTO;



public interface AuthService {

    void signup(SignupRequestDTO request);

    String login(LoginRequestDTO request);

    void verifyOtp(VerifyOtpRequestDTO request);


}
