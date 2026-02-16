package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.response.AvailabilityResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.TimeSlotResponseDTO;
import com.ikhodalautomotive.appointment.service.AvailabilityService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    // GET : localhost:8082/api/availability/slots?date=2026-02-16
    @GetMapping("/slots")
    public ResponseEntity<TimeSlotResponseDTO> getTimeSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(availabilityService.getTimeSlotsForDate(date));
    }

    // GET : localhost:8082/api/availability/check?date=2026-02-16
    @GetMapping("/check")
    public ResponseEntity<AvailabilityResponseDTO> checkAvailability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(availabilityService.getAvailabilityForDate(date));
    }
}
