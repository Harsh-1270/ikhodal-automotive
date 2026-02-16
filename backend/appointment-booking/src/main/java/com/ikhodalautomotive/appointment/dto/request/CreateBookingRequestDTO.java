package com.ikhodalautomotive.appointment.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import lombok.Data;

@Data
public class CreateBookingRequestDTO {

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private List<Long> serviceIds;

    // Vehicle information
    private String registrationNumber;
    private String make;
    private String model;
    private String year;

    // Contact information
    private String fullName;
    private String address;
    private String postcode;
    private String additionalComments;

}
