package com.ikhodalautomotive.appointment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ikhodalautomotive.appointment.dto.request.AppointmentDetailsRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.ApiResponseDTO;
import com.ikhodalautomotive.appointment.service.AppointmentDetailsService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentDetailsController {

    private final AppointmentDetailsService detailsService;

    public AppointmentDetailsController(AppointmentDetailsService detailsService) {
        this.detailsService = detailsService;
    }

    // POST : localhost:8082/api/appointments/{appointmentId}/details
    @PostMapping("/{appointmentId}/details")
    public ResponseEntity<ApiResponseDTO> saveDetails(
            @PathVariable Long appointmentId,
            @RequestBody AppointmentDetailsRequestDTO request,
            Authentication authentication
    ) {
        detailsService.saveAppointmentDetails(
                appointmentId,
                request,
                authentication.getName()
        );

        return ResponseEntity.ok(
                new ApiResponseDTO("Appointment details saved successfully")
        );
    }
}
