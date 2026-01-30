package com.ikhodalautomotive.appointment.dto.request;

import lombok.Data;

@Data
public class AppointmentDetailsRequestDTO {

    private String registrationNumber;   // optional
    private String carMakeModel;
    private Integer carYear;

    private String fullName;
    private String address;
    private String postCode;

    private String additionalComments;   // optional
}
