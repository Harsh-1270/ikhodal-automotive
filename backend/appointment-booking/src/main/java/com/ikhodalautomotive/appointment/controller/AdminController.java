package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.CreateServiceRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.UserResponseDTO;
import com.ikhodalautomotive.appointment.service.AvailabilityService;
import com.ikhodalautomotive.appointment.service.ServiceService;
import com.ikhodalautomotive.appointment.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ServiceService serviceService;

    @Autowired
    private UserService userService;

    @Autowired
    private final AvailabilityService availabilityService;

    // GET : localhost:8082/api/admin/getAllUsers
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok().body(
                userService.getAllUsers());
    }

    // POST : localhost:8082/api/admin/addServices
    @PostMapping("/addServices")
    public ResponseEntity<String> addService(
            @Valid @RequestBody CreateServiceRequestDTO request) {

        serviceService.addService(request);
        return ResponseEntity.ok("Service added successfully");
    }

    // POST : localhost:8082/api/admin/addAvailabilityRule
    @PostMapping("/addAvailabilityRule")
    public ResponseEntity<?> addRule(@RequestBody AvailabilityRequestDTO dto) {
        availabilityService.addAvailabilityRule(dto);
        return ResponseEntity.ok("Availability rule added");
    }
}
