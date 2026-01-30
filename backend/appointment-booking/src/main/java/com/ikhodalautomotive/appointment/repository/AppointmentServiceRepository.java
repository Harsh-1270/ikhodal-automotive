package com.ikhodalautomotive.appointment.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ikhodalautomotive.appointment.model.AppointmentService;

public interface AppointmentServiceRepository
        extends JpaRepository<AppointmentService, Long> {
}
