package com.ikhodalautomotive.appointment.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointment_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One-to-one with appointments
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @Column(name = "registration_number")
    private String registrationNumber;

    @Column(name = "car_make_model", nullable = false)
    private String carMakeModel;

    @Column(name = "car_year", nullable = false)
    private Integer carYear;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String address;

    @Column(name = "post_code", nullable = false)
    private String postCode;

    @Column(name = "additional_comments")
    private String additionalComments;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
