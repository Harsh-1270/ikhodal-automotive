package com.ikhodalautomotive.appointment.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleOverrideRequestDTO {

    private LocalDate date;
    private String overrideType; // HOLIDAY, UNAVAILABLE, SLOT_BLOCKED
    private LocalTime startTime; // null for full-day
    private LocalTime endTime; // null for full-day

}
