package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.CreateServiceRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.ServiceResponseDTO;
import java.util.List;

public interface ServiceService {

    void addService(CreateServiceRequestDTO request);

    List<ServiceResponseDTO> getAllActiveServices();

    void seedServices();
}
