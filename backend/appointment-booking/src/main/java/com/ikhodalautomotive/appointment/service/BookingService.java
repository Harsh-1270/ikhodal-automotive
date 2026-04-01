package com.ikhodalautomotive.appointment.service;

import java.util.List;

import com.ikhodalautomotive.appointment.dto.request.CreateBookingRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.AdminBookingResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingDetailsResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.MyBookingResponseDTO;
import com.ikhodalautomotive.appointment.dto.response.VehicleDetailsResponseDTO;

public interface BookingService {

    BookingResponseDTO createBooking(CreateBookingRequestDTO request, String userEmail);

    List<MyBookingResponseDTO> getMyBookings(String userEmail);

    BookingDetailsResponseDTO getBookingById(Long bookingId, String userEmail, boolean isAdmin);

    // Admin methods
    List<AdminBookingResponseDTO> getAllBookingsForAdmin(String status);

    void completeBooking(Long bookingId);

    void deleteBooking(Long bookingId);

    /**
     * User-facing cancel: deletes a PENDING booking owned by the user
     * and cancels the associated Stripe PaymentIntent if one exists.
     */
    void cancelBooking(Long bookingId, String userEmail);

    VehicleDetailsResponseDTO getLastVehicleDetails(String userEmail);
}
