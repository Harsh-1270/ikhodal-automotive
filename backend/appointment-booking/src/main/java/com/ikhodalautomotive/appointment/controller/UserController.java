package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.response.AvailabilityResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.ServiceResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.TimeSlotResponseDTO;
import com.ikhodalautomotive.appointment.service.AvailabilityService;
import com.ikhodalautomotive.appointment.service.ServiceService;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private ServiceService serviceService;

    private final AvailabilityService availabilityService;

    // GET : localhost:8082/api/getAllServices
    @GetMapping("/getAllServices")
    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllActiveServices());
    }

    // GET : localhost:8082/api/getAvailability?date=2024-12-25
    @GetMapping("/getAvailability")
    public AvailabilityResponseDTO getAvailability(@RequestParam String date) {
        return availabilityService.getAvailabilityForDate(LocalDate.parse(date));
    }

    // GET : localhost:8082/api/getSlots?date=2026-02-09
    @GetMapping("/getSlots")
    public TimeSlotResponseDTO getTimeSlots(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return availabilityService.getTimeSlotsForDate(date);
    }

}
