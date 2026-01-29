package com.ikhodalautomotive.appointment.controller;
import com.ikhodalautomotive.appointment.dto.response.ServiceResponseDTO;
import com.ikhodalautomotive.appointment.service.ServiceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    // GET : localhost:8082/api/services
    @GetMapping
    public ResponseEntity<List<ServiceResponseDTO>> getAllServices() {
        return ResponseEntity.ok(serviceService.getAllActiveServices());
    }
}
