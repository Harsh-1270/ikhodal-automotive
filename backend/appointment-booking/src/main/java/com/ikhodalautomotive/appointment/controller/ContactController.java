package com.ikhodalautomotive.appointment.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ikhodalautomotive.appointment.dto.request.ContactMessageRequestDTO;
import com.ikhodalautomotive.appointment.service.EmailService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
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
            log.info("Received contact form submission from: {}", request.getEmail());
            emailService.sendContactMessageToAdmin(
                    request.getName(),
                    request.getEmail(),
                    request.getSubject() != null ? request.getSubject() : "No Subject",
                    request.getMessage());
            response.put("success", true);
            response.put("message", "Message sent successfully! We will get back to you soon.");
            log.info("Contact message sent successfully for: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to send contact message from {}: {}", request.getEmail(), e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Failed to send message. Please try again later.");
            return ResponseEntity.status(500).body(response);
        }
    }
}
