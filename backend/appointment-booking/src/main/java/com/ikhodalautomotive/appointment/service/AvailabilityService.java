package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AvailabilityResponseDTO;

import java.time.LocalDate;

public interface AvailabilityService {

    void addAvailabilityRule(AvailabilityRequestDTO dto);

    AvailabilityResponseDTO getAvailabilityForDate(LocalDate date);

    boolean isSlotAvailable(
            LocalDate date,
            java.time.LocalTime start,
            java.time.LocalTime end
    );
}
