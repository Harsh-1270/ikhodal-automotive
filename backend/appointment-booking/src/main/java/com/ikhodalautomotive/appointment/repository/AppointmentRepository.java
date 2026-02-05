package com.ikhodalautomotive.appointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ikhodalautomotive.appointment.model.Appointment;
import com.ikhodalautomotive.appointment.model.AppointmentService;

public interface AppointmentRepository
                extends JpaRepository<Appointment, Long> {

        List<Appointment> findByUserEmailOrderByCreatedAtDesc(String email);
}
