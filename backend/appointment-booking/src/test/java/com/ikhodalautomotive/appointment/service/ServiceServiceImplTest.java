package com.ikhodalautomotive.appointment.service;

import com.ikhodalautomotive.appointment.dto.request.CreateServiceRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.ServiceResponseDTO;
import com.ikhodalautomotive.appointment.model.Services;
import com.ikhodalautomotive.appointment.repository.ServiceRepository;
import com.ikhodalautomotive.appointment.service.impl.ServiceServiceImpl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ServiceServiceImplTest {

    @Mock
    private ServiceRepository serviceRepository;

    @InjectMocks
    private ServiceServiceImpl serviceService;

    // ================= GET ACTIVE SERVICES =================

    @Test
    void shouldReturnOnlyActiveServices() {

        Services s1 = new Services();
        s1.setId(1L);
        s1.setName("Oil Change");
        s1.setDescription("Basic oil change");
        s1.setPrice(BigDecimal.valueOf(100));

        Services s2 = new Services();
        s2.setId(2L);
        s2.setName("Full Service");
        s2.setDescription("Complete car service");
        s2.setPrice(BigDecimal.valueOf(300));

        when(serviceRepository.findByIsActiveTrue())
                .thenReturn(List.of(s1, s2));

        List<ServiceResponseDTO> result =
                serviceService.getAllActiveServices();

        assertEquals(2, result.size());
        assertEquals("Oil Change", result.get(0).getName());
        assertEquals(BigDecimal.valueOf(300), result.get(1).getPrice());
    }

    @Test
    void shouldReturnEmptyListWhenNoActiveServices() {

        when(serviceRepository.findByIsActiveTrue())
                .thenReturn(List.of());

        List<ServiceResponseDTO> result =
                serviceService.getAllActiveServices();

        assertTrue(result.isEmpty());
    }

    // ================= ADD SERVICE =================

    @Test
    void shouldAddServiceWithActiveTrueByDefault() {

        CreateServiceRequestDTO dto = new CreateServiceRequestDTO();
        dto.setName("Brake Service");
        dto.setDescription("Brake inspection");
        dto.setPrice(BigDecimal.valueOf(200));
        dto.setIsActive(null); // default case

        serviceService.addService(dto);

        verify(serviceRepository, times(1))
                .save(any(Services.class));
    }

    @Test
    void shouldAddServiceWithExplicitIsActiveFalse() {

        CreateServiceRequestDTO dto = new CreateServiceRequestDTO();
        dto.setName("Old Service");
        dto.setDescription("Deprecated");
        dto.setPrice(BigDecimal.valueOf(50));
        dto.setIsActive(false);

        serviceService.addService(dto);

        verify(serviceRepository, times(1))
                .save(argThat(service ->
                        service.getIsActive().equals(false)
                ));
    }
}
