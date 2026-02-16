package com.ikhodalautomotive.appointment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MyBookingResponseDTO {

    private Long bookingId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private BigDecimal totalAmount;
    private String serviceNames;

    // Vehicle & contact info
    private String vehicleMake;
    private String vehicleModel;
    private String fullName;
    private String address;
}
