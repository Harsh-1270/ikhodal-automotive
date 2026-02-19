package com.ikhodalautomotive.appointment.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikhodalautomotive.appointment.dto.request.AvailabilityRequestDTO;
import com.ikhodalautomotive.appointment.dto.request.CreateServiceRequestDTO;
import com.ikhodalautomotive.appointment.dto.response.UserResponseDTO;
import com.ikhodalautomotive.appointment.service.AvailabilityService;
import com.ikhodalautomotive.appointment.service.ServiceService;
import com.ikhodalautomotive.appointment.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ServiceService serviceService;

    @MockBean
    private UserService userService;

    @MockBean
    private AvailabilityService availabilityService;

    // ================= GET ALL USERS =================

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    void shouldReturnAllUsersForAdmin() throws Exception {

        List<UserResponseDTO> users = List.of(
                UserResponseDTO.builder().name("User One").email("one@test.com").build(),
                UserResponseDTO.builder().name("User Two").email("two@test.com").build());

        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/admin/getAllUsers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()").value(2))
                .andExpect(jsonPath("$[0].email").value("one@test.com"));
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldForbidUserFromGettingAllUsers() throws Exception {

        mockMvc.perform(get("/api/admin/getAllUsers"))
                .andExpect(status().isForbidden());
    }

    // ================= ADD SERVICE =================

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    void shouldAllowAdminToAddService() throws Exception {

        CreateServiceRequestDTO dto = new CreateServiceRequestDTO();
        dto.setName("Oil Change");
        dto.setDescription("Basic service");
        dto.setPrice(BigDecimal.valueOf(100));
        dto.setIsActive(true);

        doNothing().when(serviceService).addService(dto);

        mockMvc.perform(
                post("/api/admin/addServices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Service added successfully"));
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldForbidUserFromAddingService() throws Exception {

        mockMvc.perform(
                post("/api/admin/addServices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }

    // ================= ADD AVAILABILITY RULE =================

    @Test
    @WithMockUser(username = "admin@test.com", roles = "ADMIN")
    void shouldAllowAdminToAddAvailabilityRule() throws Exception {

        AvailabilityRequestDTO dto = new AvailabilityRequestDTO();
        dto.setDayOfWeek(DayOfWeek.MONDAY);
        dto.setStartTime(LocalTime.of(10, 0));
        dto.setEndTime(LocalTime.of(12, 0));
        dto.setIsAvailable(false);

        doNothing().when(availabilityService).addAvailabilityRule(dto);

        mockMvc.perform(
                post("/api/admin/addAvailabilityRule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Availability rule added"));
    }

    @Test
    @WithMockUser(username = "user@test.com", roles = "USER")
    void shouldForbidUserFromAddingAvailabilityRule() throws Exception {

        mockMvc.perform(
                post("/api/admin/addAvailabilityRule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isForbidden());
    }
}
