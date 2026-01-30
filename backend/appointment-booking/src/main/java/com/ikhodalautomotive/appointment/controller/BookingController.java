package com.ikhodalautomotive.appointment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.ikhodalautomotive.appointment.dto.request.CreateBookingRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingResponseDTO;
import com.ikhodalautomotive.appointment.service.BookingService;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // POST : localhost:8082/api/createBooking
    @PostMapping("/createBooking")
    public ResponseEntity<BookingResponseDTO> createBooking(
            @RequestBody CreateBookingRequestDTO request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        BookingResponseDTO response =
                bookingService.createBooking(request, userEmail);

        return ResponseEntity.ok(response);
    }
}
