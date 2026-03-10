package com.ikhodalautomotive.appointment.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.AppointmentDetails;

public interface AppointmentDetailsRepository
        extends JpaRepository<AppointmentDetails, Long> {

    Optional<AppointmentDetails> findByAppointment(Appointment appointment);

    void deleteByAppointmentIdIn(java.util.List<Long> appointmentIds);
}
