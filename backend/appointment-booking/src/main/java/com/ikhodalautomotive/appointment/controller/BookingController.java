package com.ikhodalautomotive.appointment.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import com.ikhodalautomotive.appointment.dto.request.CreateBookingRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingDetailsResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.MyBookingResponseDTO;
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
            Authentication authentication) {
        String userEmail = authentication.getName();

        BookingResponseDTO response = bookingService.createBooking(request, userEmail);

        return ResponseEntity.ok(response);
    }

    // GET : localhost:8082/api/bookings/my
    @GetMapping("/bookings/my")
    public ResponseEntity<List<MyBookingResponseDTO>> getMyBookings(
            Authentication authentication) {
        String userEmail = authentication.getName();

        return ResponseEntity.ok(
                bookingService.getMyBookings(userEmail));
    }

    // GET : localhost:8082/api/bookings/{bookingId}
    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<BookingDetailsResponseDTO> getBookingById(
            @PathVariable Long bookingId,
            Authentication authentication) {

        String userEmail = authentication.getName();

        boolean isAdmin = authentication.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        return ResponseEntity.ok(
                bookingService.getBookingById(bookingId, userEmail, isAdmin));
    }

}
