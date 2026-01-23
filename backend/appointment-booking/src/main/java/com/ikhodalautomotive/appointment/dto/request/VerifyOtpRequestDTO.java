package com.ikhodalautomotive.appointment.dto.request;

import lombok.Data;

@Data
public class VerifyOtpRequestDTO {
    private String email;
    private String otp;

    public String getEmail() {
        return email;
    }
    public String getOtp() {
        return otp;
    }

}
