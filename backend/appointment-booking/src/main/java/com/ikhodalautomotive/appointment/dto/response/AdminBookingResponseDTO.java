package com.ikhodalautomotive.appointment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminBookingResponseDTO {

    private Long bookingId;
    private String userName;
    private String userEmail;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private BigDecimal totalAmount;
    private String serviceNames;
    private String serviceIcon;
    private String vehicleMake;
    private String vehicleModel;
    private String address;
    private LocalDateTime createdAt;
}
