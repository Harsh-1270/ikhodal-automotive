package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AvailabilityResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.TimeSlotResponseDTO;
import com.ikhodalautomotive.appointment.model.ScheduleOverride;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AvailabilityService {

    void addAvailabilityRule(AvailabilityRequestDTO dto);

    AvailabilityResponseDTO getAvailabilityForDate(LocalDate date);

    boolean isSlotAvailable(
            LocalDate date,
            java.time.LocalTime start,
            java.time.LocalTime end);

    TimeSlotResponseDTO getTimeSlotsForDate(LocalDate date);

    // Schedule Override methods
    List<ScheduleOverride> getScheduleOverrides(int year, int month);

    ScheduleOverride addScheduleOverride(LocalDate date, String overrideType,
            LocalTime startTime, LocalTime endTime);

    void removeScheduleOverride(LocalDate date, String overrideType,
            LocalTime startTime, LocalTime endTime);
}
