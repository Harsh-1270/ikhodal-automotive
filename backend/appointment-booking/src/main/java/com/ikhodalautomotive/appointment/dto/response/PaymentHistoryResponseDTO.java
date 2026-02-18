package com.ikhodalautomotive.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentHistoryResponseDTO {
    private Long id;
    private Long bookingId;
    private BigDecimal amount;
    private LocalDateTime date;
    private String status;
    private String serviceName;
    private String serviceIcon;
    private String invoiceNumber;
    private String paymentMethod;
    private String time;
}
