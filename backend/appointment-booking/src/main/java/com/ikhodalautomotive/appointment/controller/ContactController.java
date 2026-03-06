package com.ikhodalautomotive.appointment.controller;

import com.ikhodalautomotive.appointment.dto.request.ContactMessageRequestDTO;
import com.ikhodalautomotive.appointment.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> sendContactMessage(@RequestBody ContactMessageRequestDTO request) {
        Map<String, Object> response = new HashMap<>();
        try {
            emailService.sendContactMessageToAdmin(
                    request.getName(),
                    request.getEmail(),
                    request.getSubject() != null ? request.getSubject() : "No Subject",
                    request.getMessage());
            response.put("success", true);
            response.put("message", "Message sent successfully! We will get back to you soon.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to send message. Please try again later.");
            return ResponseEntity.status(500).body(response);
        }
    }
}
