package com.ikhodalautomotive.appointment.service.impl;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.AppointmentService;
import com.ikhodalautomotive.appointment.model.Services;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentServiceRepository;
import com.ikhodalautomotive.appointment.repository.ServiceRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.AvailabilityService;
import com.ikhodalautomotive.appointment.service.BookingService;
import com.ikhodalautomotive.appointment.dto.request.CreateBookingRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.BookingResponseDTO;

@Service
public class BookingServiceImpl implements BookingService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentServiceRepository appointmentServiceRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final AvailabilityService availabilityService;

    public BookingServiceImpl(
            AppointmentRepository appointmentRepository,
            AppointmentServiceRepository appointmentServiceRepository,
            ServiceRepository serviceRepository,
            UserRepository userRepository,
            AvailabilityService availabilityService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.appointmentServiceRepository = appointmentServiceRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
        this.availabilityService = availabilityService;
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(CreateBookingRequestDTO request, String userEmail) {

        // 1️⃣ Validate slot availability (CRITICAL)
        boolean available = availabilityService.isSlotAvailable(
                request.getDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (!available) {
            throw new ApiException("Selected time slot is no longer available");
        }

        // 2️⃣ Fetch user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        // 3️⃣ Create appointment
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setAppointmentDate(request.getDate());
        appointment.setStartTime(request.getStartTime());
        appointment.setEndTime(request.getEndTime());
        appointment.setStatus("PENDING");
        appointment.setCreatedAt(LocalDateTime.now());

        appointmentRepository.save(appointment);

        // 4️⃣ Attach services
        List<Services> services =
                serviceRepository.findAllById(request.getServiceIds());

        if (services.size() != request.getServiceIds().size()) {
            throw new ApiException("One or more services are invalid");
        }

        for (Services service : services) {
            AppointmentService as = new AppointmentService();
            as.setAppointment(appointment);
            as.setService(service);
            as.setServicePrice(service.getPrice());

            appointmentServiceRepository.save(as);
        }

        // 5️⃣ Response
        return new BookingResponseDTO(
                appointment.getId(),
                appointment.getStatus(),
                "Booking created successfully"
        );
    }
}
