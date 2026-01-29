package com.ikhodalautomotive.appointment.service.impl;

import com.ikhodalautomotive.appointment.dto.request.CreateServiceRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.ServiceResponseDTO;
import com.ikhodalautomotive.appointment.repository.ServiceRepository;
import com.ikhodalautomotive.appointment.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ikhodalautomotive.appointment.model.Services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceServiceImpl implements ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public List<ServiceResponseDTO> getAllActiveServices() {

        return serviceRepository.findByIsActiveTrue()
                .stream()
                .map(service -> {
                    ServiceResponseDTO dto = new ServiceResponseDTO();
                    dto.setId(service.getId());
                    dto.setName(service.getName());
                    dto.setDescription(service.getDescription());
                    dto.setPrice(service.getPrice());
                    return dto;
                })
                .collect(Collectors.toList());
    }


    @Override
    public void addService(CreateServiceRequestDTO request) {

        Services service = new Services();
        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());

        // default active = true
        service.setIsActive(
                request.getIsActive() != null ? request.getIsActive() : true
        );

        service.setCreatedAt(LocalDateTime.now());

        serviceRepository.save(service);
    }
}
