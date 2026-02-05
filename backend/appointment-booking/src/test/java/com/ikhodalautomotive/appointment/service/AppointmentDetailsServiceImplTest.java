package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.AppointmentDetailsRequestDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.AppointmentDetails;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.repository.AppointmentDetailsRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.impl.AppointmentDetailsServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentDetailsServiceImplTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private AppointmentDetailsRepository detailsRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AppointmentDetailsServiceImpl service;

    private AppointmentDetailsRequestDTO buildRequest() {
        AppointmentDetailsRequestDTO dto = new AppointmentDetailsRequestDTO();
        dto.setRegistrationNumber("GJ01AB1234");
        dto.setCarMakeModel("Honda City");
        dto.setCarYear(2021);
        dto.setFullName("Test User");
        dto.setAddress("Ahmedabad");
        dto.setPostCode("380001");
        dto.setAdditionalComments("Test comment");
        return dto;
    }

    @Test
    void shouldSaveAppointmentDetailsSuccessfully() {

        User user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");

        Appointment appointment = new Appointment();
        appointment.setId(10L);
        appointment.setUser(user);

        when(appointmentRepository.findById(10L))
                .thenReturn(Optional.of(appointment));

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(detailsRepository.findByAppointment(appointment))
                .thenReturn(Optional.empty());

        service.saveAppointmentDetails(10L, buildRequest(), "user@test.com");

        verify(detailsRepository, times(1))
                .save(any(AppointmentDetails.class));
    }

    @Test
    void shouldThrowExceptionWhenAppointmentNotFound() {

        when(appointmentRepository.findById(10L))
                .thenReturn(Optional.empty());

        ApiException ex = assertThrows(
                ApiException.class,
                () -> service.saveAppointmentDetails(10L, buildRequest(), "user@test.com")
        );

        assertEquals("Appointment not found", ex.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenUserNotFound() {

        Appointment appointment = new Appointment();
        appointment.setId(10L);

        when(appointmentRepository.findById(10L))
                .thenReturn(Optional.of(appointment));

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.empty());

        ApiException ex = assertThrows(
                ApiException.class,
                () -> service.saveAppointmentDetails(10L, buildRequest(), "user@test.com")
        );

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenAppointmentDoesNotBelongToUser() {

        User owner = new User();
        owner.setId(1L);

        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("user@test.com");

        Appointment appointment = new Appointment();
        appointment.setUser(owner);

        when(appointmentRepository.findById(10L))
                .thenReturn(Optional.of(appointment));

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(otherUser));

        ApiException ex = assertThrows(
                ApiException.class,
                () -> service.saveAppointmentDetails(10L, buildRequest(), "user@test.com")
        );

        assertEquals("You are not allowed to modify this booking", ex.getMessage());
    }

    @Test
    void shouldThrowExceptionWhenDetailsAlreadySubmitted() {

        User user = new User();
        user.setId(1L);
        user.setEmail("user@test.com");

        Appointment appointment = new Appointment();
        appointment.setUser(user);

        when(appointmentRepository.findById(10L))
                .thenReturn(Optional.of(appointment));

        when(userRepository.findByEmail("user@test.com"))
                .thenReturn(Optional.of(user));

        when(detailsRepository.findByAppointment(appointment))
                .thenReturn(Optional.of(new AppointmentDetails()));

        ApiException ex = assertThrows(
                ApiException.class,
                () -> service.saveAppointmentDetails(10L, buildRequest(), "user@test.com")
        );

        assertEquals("Appointment details already submitted", ex.getMessage());
    }
}
