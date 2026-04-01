package com.ikhodalautomotive.appointment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ikhodalautomotive.appointment.model.Appointment;
// import com.ikhodalautomotive.appointment.model.AppointmentService;

public interface AppointmentRepository
                extends JpaRepository<Appointment, Long> {

        List<Appointment> findByUserEmailOrderByCreatedAtDesc(String email);

        List<Appointment> findByAppointmentDateAndStatusNot(java.time.LocalDate date, String status);

        List<Appointment> findByAppointmentDateAndStatusIn(java.time.LocalDate date, List<String> statuses);

        List<Appointment> findAllByOrderByCreatedAtDesc();

        List<Appointment> findByStatusOrderByCreatedAtDesc(String status);

        long countByUserId(Long userId);

        List<Appointment> findByUserId(Long userId);
}
