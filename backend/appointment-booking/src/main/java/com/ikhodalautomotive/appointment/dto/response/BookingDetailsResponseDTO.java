package com.ikhodalautomotive.appointment.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BookingDetailsResponseDTO {

    private Long bookingId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private BigDecimal totalAmount;
    private List<ServiceItemDTO> services;

    @Data
    @AllArgsConstructor
    public static class ServiceItemDTO {
        private Long serviceId;
        private String serviceName;
        private BigDecimal price;
    }
}
