package com.ikhodalautomotive.appointment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ikhodalautomotive.appointment.model.Appointment;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {
}
