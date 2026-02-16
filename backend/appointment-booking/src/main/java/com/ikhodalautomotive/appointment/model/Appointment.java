package com.ikhodalautomotive.appointment.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FK → users.id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private String status; // PENDING, COMPLETED, CONFIRMED (later)

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Vehicle information
    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "vehicle_make")
    private String vehicleMake;

    @Column(name = "vehicle_model")
    private String vehicleModel;

    @Column(name = "vehicle_year")
    private String vehicleYear;

    // Contact information
    @Column(name = "full_name")
    private String fullName;

    @Column(name = "address")
    private String address;

    @Column(name = "postcode")
    private String postcode;

    @Column(name = "additional_comments", length = 500)
    private String additionalComments;
}
