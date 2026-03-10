package com.ikhodalautomotive.appointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ikhodalautomotive.appointment.model.AppointmentService;

public interface AppointmentServiceRepository
        extends JpaRepository<AppointmentService, Long> {

    List<AppointmentService> findByAppointment_Id(Long appointmentId);

    void deleteByAppointmentIdIn(java.util.List<Long> appointmentIds);
}
