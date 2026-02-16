package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.request.CreateServiceRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.ApiResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.ServiceResponseDTO;
import com.ikhodalautomotive.appointment.service.ServiceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllActiveServices());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponseDTO> addService(@Valid @RequestBody CreateServiceRequestDTO request) {
        serviceService.addService(request);
        return ResponseEntity.ok(new ApiResponseDTO("Service added successfully"));
    }

    @PostMapping("/seed")
    public ResponseEntity<ApiResponseDTO> seedServices() {
        serviceService.seedServices();
        return ResponseEntity.ok(new ApiResponseDTO("Services seeded successfully"));
    }

    // Allow GET for seeding as well for easier browser access if needed during dev
    @GetMapping("/seed")
    public ResponseEntity<ApiResponseDTO> seedServicesGet() {
        serviceService.seedServices();
        return ResponseEntity.ok(new ApiResponseDTO("Services seeded successfully"));
    }
}
