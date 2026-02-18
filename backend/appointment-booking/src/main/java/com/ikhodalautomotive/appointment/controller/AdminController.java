package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.CreateServiceRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AdminBookingResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.UserResponseDTO;
import com.ikhodalautomotive.appointment.service.AvailabilityService;
import com.ikhodalautomotive.appointment.service.BookingService;
import com.ikhodalautomotive.appointment.service.ServiceService;
import com.ikhodalautomotive.appointment.service.UserService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @Autowired
    private final BookingService bookingService;

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

    // GET : localhost:8082/api/admin/appointments?status=CONFIRMED
    @GetMapping("/appointments")
    public ResponseEntity<List<AdminBookingResponseDTO>> getAllAppointments(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(bookingService.getAllBookingsForAdmin(status));
    }

    // PUT : localhost:8082/api/admin/appointments/{id}/status
    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<String> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if ("COMPLETED".equalsIgnoreCase(status)) {
            bookingService.completeBooking(id);
        }
        return ResponseEntity.ok("Appointment status updated to " + status);
    }

    // DELETE : localhost:8082/api/admin/appointments/{id}
    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Appointment deleted successfully");
    }
}
