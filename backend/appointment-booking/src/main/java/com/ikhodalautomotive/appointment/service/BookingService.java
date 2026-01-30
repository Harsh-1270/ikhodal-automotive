package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.CreateBookingRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingResponseDTO;

public interface BookingService {

    BookingResponseDTO createBooking(CreateBookingRequestDTO request, String userEmail);
}
