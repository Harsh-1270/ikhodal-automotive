package com.ikhodalautomotive.appointment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDetailsResponseDTO {
    private String registrationNumber;
    private String vehicleMake;
    private String vehicleModel;
    private String vehicleYear;
    private String fullName;
    private String address;
    private String postcode;
}
