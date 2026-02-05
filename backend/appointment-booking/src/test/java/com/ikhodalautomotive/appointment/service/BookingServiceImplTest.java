package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.CreateBookingRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingResponseDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.*;
import com.ikhodalautomotive.appointment.repository.*;
import com.ikhodalautomotive.appointment.service.impl.BookingServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private AppointmentServiceRepository appointmentServiceRepository;

    @Mock
    private ServiceRepository serviceRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AvailabilityService availabilityService;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private CreateBookingRequestDTO buildValidRequest() {
        CreateBookingRequestDTO dto = new CreateBookingRequestDTO();
        dto.setDate(LocalDate.of(2026, 2, 2));
        dto.setStartTime(LocalTime.of(10, 0));
        dto.setEndTime(LocalTime.of(11, 0));
        dto.setServiceIds(List.of(1L, 2L));
        return dto;
    }

    @Test
    void shouldThrowExceptionWhenSlotIsNotAvailable() {

        CreateBookingRequestDTO request = buildValidRequest();

        when(availabilityService.isSlotAvailable(
                request.getDate(),
                request.getStartTime(),
                request.getEndTime())).thenReturn(false);

        ApiException ex = assertThrows(
                ApiException.class,
                () -> bookingService.createBooking(request, "user@test.com"));

        assertEquals("Selected time slot is no longer available", ex.getMessage());

        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void shouldThrowExceptionWhenServiceIdsAreInvalid() {

        CreateBookingRequestDTO request = buildValidRequest();

        when(availabilityService.isSlotAvailable(any(), any(), any()))
                .thenReturn(true);

        User user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(serviceRepository.findAllById(request.getServiceIds()))
                .thenReturn(List.of()); // missing services

        ApiException ex = assertThrows(
                ApiException.class,
                () -> bookingService.createBooking(request, "user@test.com"));

        assertEquals("One or more services are invalid", ex.getMessage());
    }

    @Test
    void shouldCreateBookingWithPendingStatus() {

        CreateBookingRequestDTO request = buildValidRequest();

        when(availabilityService.isSlotAvailable(any(), any(), any()))
                .thenReturn(true);

        User user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        Services s1 = new Services();
        s1.setId(1L);
        s1.setPrice(BigDecimal.valueOf(100));

        Services s2 = new Services();
        s2.setId(2L);
        s2.setPrice(BigDecimal.valueOf(200));

        when(serviceRepository.findAllById(request.getServiceIds()))
                .thenReturn(List.of(s1, s2));

        BookingResponseDTO response = bookingService.createBooking(request, "user@test.com");

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());

        verify(appointmentRepository, times(1)).save(any(Appointment.class));
        verify(appointmentServiceRepository, times(2))
                .save(any(AppointmentService.class));
    }

}
