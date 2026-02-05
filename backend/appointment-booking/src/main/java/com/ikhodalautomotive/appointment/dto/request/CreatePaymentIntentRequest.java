package com.ikhodalautomotive.appointment.dto.request;

import lombok.Data;

@Data
public class CreatePaymentIntentRequest {
    private Long appointmentId;
}
