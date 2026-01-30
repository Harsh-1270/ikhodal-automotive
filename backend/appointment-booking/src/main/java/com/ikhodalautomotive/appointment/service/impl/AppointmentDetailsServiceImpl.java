package com.ikhodalautomotive.appointment.service.impl;


import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ikhodalautomotive.appointment.dto.request.AppointmentDetailsRequestDTO;
import com.ikhodalautomotive.appointment.exception.ApiException;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.AppointmentDetails;
import com.ikhodalautomotive.appointment.model.User;
import com.ikhodalautomotive.appointment.repository.AppointmentDetailsRepository;
import com.ikhodalautomotive.appointment.repository.AppointmentRepository;
import com.ikhodalautomotive.appointment.repository.UserRepository;
import com.ikhodalautomotive.appointment.service.AppointmentDetailsService;

@Service
public class AppointmentDetailsServiceImpl
        implements AppointmentDetailsService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentDetailsRepository detailsRepository;
    private final UserRepository userRepository;

    public AppointmentDetailsServiceImpl(
            AppointmentRepository appointmentRepository,
            AppointmentDetailsRepository detailsRepository,
            UserRepository userRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.detailsRepository = detailsRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void saveAppointmentDetails(
            Long appointmentId,
            AppointmentDetailsRequestDTO request,
            String userEmail
    ) {

        // 1️⃣ Fetch appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ApiException("Appointment not found"));

        // 2️⃣ Ensure appointment belongs to logged-in user
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ApiException("User not found"));

        if (!appointment.getUser().getId().equals(user.getId())) {
            throw new ApiException("You are not allowed to modify this booking");
        }

        // 3️⃣ Prevent duplicate details submission
        detailsRepository.findByAppointment(appointment)
                .ifPresent(d -> {
                    throw new ApiException("Appointment details already submitted");
                });

        // 4️⃣ Save details
        AppointmentDetails details = AppointmentDetails.builder()
                .appointment(appointment)
                .registrationNumber(request.getRegistrationNumber())
                .carMakeModel(request.getCarMakeModel())
                .carYear(request.getCarYear())
                .fullName(request.getFullName())
                .address(request.getAddress())
                .postCode(request.getPostCode())
                .additionalComments(request.getAdditionalComments())
                .createdAt(LocalDateTime.now())
                .build();

        detailsRepository.save(details);
    }
}
