package com.ikhodalautomotive.appointment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class BookingDetailsResponseDTO {

    private Long bookingId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private BigDecimal totalAmount;
    private String serviceIcon;
    private List<ServiceItemDTO> services;

    // Vehicle information
    private String registrationNumber;
    private String vehicleMake;
    private String vehicleModel;
    private String vehicleYear;

    // Contact information
    private String fullName;
    private String address;
    private String postcode;
    private String additionalComments;

    // Customer info (from User table)
    private String customerEmail;

    // Payment info (from Payment table)
    private String paymentStatus;
    private String stripePaymentId;
    private LocalDateTime paymentTime;

    @Data
    @AllArgsConstructor
    public static class ServiceItemDTO {
        private Long serviceId;
        private String serviceName;
        private BigDecimal price;
    }
}
